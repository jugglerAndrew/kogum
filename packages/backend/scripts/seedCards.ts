import pool, { query } from "../src/db"; // Adjust path if your db module is elsewhere

interface MetaAttribute {
  id: number;
  name: string;
}

async function fetchMetaAttributes(
  tableName: string,
  idColumn: string,
  nameColumn: string
): Promise<MetaAttribute[]> {
  const res = await query(
    `SELECT ${idColumn} as id, ${nameColumn} as name FROM ${tableName} ORDER BY ${idColumn}`
  );
  return res.rows;
}

async function seedCards() {
  console.log("Starting to seed cards...");

  try {
    // Fetch all meta attribute values
    const metaCounts = await fetchMetaAttributes(
      "meta_count",
      "meta_count_id",
      "meta_count_name"
    );
    const metaColors = await fetchMetaAttributes(
      "meta_color",
      "meta_color_id",
      "meta_color_name"
    );
    const metaFills = await fetchMetaAttributes(
      "meta_fill",
      "meta_fill_id",
      "meta_fill_name"
    );
    const metaShapes = await fetchMetaAttributes(
      "meta_shape",
      "meta_shape_id",
      "meta_shape_name"
    );

    if (
      !metaCounts.length ||
      !metaColors.length ||
      !metaFills.length ||
      !metaShapes.length
    ) {
      console.error(
        "Error: One or more meta tables are empty. Ensure they are populated before seeding cards."
      );
      return;
    }

    console.log(
      `Workspace seed ${metaCounts.length} counts, ${metaColors.length} colors, ${metaFills.length} fills, ${metaShapes.length} shapes.`
    );

    // Clear existing cards to avoid duplicates if run multiple times
    await query("DELETE FROM card;");
    // Optional: Reset sequence if your card_id is SERIAL
    await query(
      "SELECT setval(pg_get_serial_sequence('card', 'card_id'), COALESCE(max(card_id),0) + 1, false) FROM card;"
    );

    let cardsInserted = 0;
    for (const count of metaCounts) {
      for (const color of metaColors) {
        for (const fill of metaFills) {
          for (const shape of metaShapes) {
            const cardName = `<span class="math-inline">\{count\.name\}\_</span>{color.name}_${fill.name}_${shape.name}`;
            // console.log(`Preparing to insert card: ${cardName}`);
            await query(
              `INSERT INTO card (card_name, meta_count_id, meta_color_id, meta_fill_id, meta_shape_id)
               VALUES ($1, $2, $3, $4, $5)`,
              [cardName, count.id, color.id, fill.id, shape.id]
            );
            cardsInserted++;
          }
        }
      }
    }
    console.log(`Successfully inserted ${cardsInserted} cards.`);
  } catch (error) {
    console.error("Error seeding cards:", error);
  } finally {
    await pool.end(); // Close the connection pool
    console.log("Database connection pool closed.");
  }
}

seedCards();
