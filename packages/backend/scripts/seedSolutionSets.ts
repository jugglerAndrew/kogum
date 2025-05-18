import pool, { query } from "../src/db";

interface Card {
  card_id: number;
  meta_count_id: number;
  meta_color_id: number;
  meta_fill_id: number;
  meta_shape_id: number;
  // card_name: string; // Not strictly needed for isSet logic if using meta_ids
}

// Function to determine if three attribute values form a valid component of a set
// (all same or all different)
function isValidAttributeSet(
  valA: number,
  valB: number,
  valC: number
): boolean {
  const allSame = valA === valB && valB === valC;
  const allDifferent = valA !== valB && valA !== valC && valB !== valC;
  return allSame || allDifferent;
}

// Function to check if three cards form a valid "Set"
function isSet(cardA: Card, cardB: Card, cardC: Card): boolean {
  if (
    cardA.card_id === cardB.card_id ||
    cardA.card_id === cardC.card_id ||
    cardB.card_id === cardC.card_id
  ) {
    return false; // Cards must be distinct for a set
  }

  const countIsValid = isValidAttributeSet(
    cardA.meta_count_id,
    cardB.meta_count_id,
    cardC.meta_count_id
  );
  const colorIsValid = isValidAttributeSet(
    cardA.meta_color_id,
    cardB.meta_color_id,
    cardC.meta_color_id
  );
  const fillIsValid = isValidAttributeSet(
    cardA.meta_fill_id,
    cardB.meta_fill_id,
    cardC.meta_fill_id
  );
  const shapeIsValid = isValidAttributeSet(
    cardA.meta_shape_id,
    cardB.meta_shape_id,
    cardC.meta_shape_id
  );

  // This is the core "Set" rule: all four attribute checks must pass.
  // Your very long SQL WHERE clause in c_validate_sol essentially boils down to this,
  // ensuring that not all attributes are "all different" simultaneously (which would also be valid)
  // and not all attributes are "all same" simultaneously (which is an identity, not a set of 3 distinct cards usually).
  // The standard SET game rule is simpler: each of the 4 properties must satisfy (all same OR all different).
  // Let's use the standard rule for now, it's more common and simpler to implement.
  // Your SQL seemed to enumerate all combinations *except* "all attributes are the same".
  // Which is correct if the cards must be distinct, as 3 identical cards are not a set.

  // The long WHERE clause in your SQL is just an enumeration of all valid combinations
  // of (allsame OR alldifferent) across the 4 attributes, ensuring it's not 3 identical cards.
  // The simplest way to express the rule for distinct cards is:
  // Each of the 4 attributes must be (all same OR all different) AND the cards must not be identical.
  // Our initial check for distinct card_ids handles the "not identical" part.
  return countIsValid && colorIsValid && fillIsValid && shapeIsValid;
}

async function seedSolutionSets() {
  console.log("Starting to seed solution sets...");
  try {
    const cardsResult = await query<Card>(
      "SELECT card_id, meta_count_id, meta_color_id, meta_fill_id, meta_shape_id FROM card"
    );
    const allCards = cardsResult.rows;

    if (allCards.length < 3) {
      // Need at least 3 cards to form a set
      console.error("Not enough cards in the database to form solution sets.");
      return;
    }
    console.log(`Fetched ${allCards.length} cards to check for solutions.`);

    await query("TRUNCATE TABLE solution_set RESTART IDENTITY CASCADE;"); // Clear existing solution sets

    let solutionSetCount = 0;
    const processedSetCodes = new Set<string>();

    // Iterate through all unique combinations of 3 cards
    for (let i = 0; i < allCards.length; i++) {
      for (let j = i + 1; j < allCards.length; j++) {
        for (let k = j + 1; k < allCards.length; k++) {
          const cardA = allCards[i];
          const cardB = allCards[j];
          const cardC = allCards[k];

          if (isSet(cardA, cardB, cardC)) {
            // Create the solution set code (sorted numerically)
            const cardIds = [cardA.card_id, cardB.card_id, cardC.card_id].sort(
              (a, b) => a - b
            );
            const solutionSetCode = cardIds.join("-"); // Or just concatenate: cardIds.join('')

            if (!processedSetCodes.has(solutionSetCode)) {
              // Insert each card of the set into the solution_set table
              // This matches your original schema where solution_set has (solution_set_code, card_id)
              await query(
                "INSERT INTO solution_set (solution_set_code, card_id) VALUES ($1, $2)",
                [solutionSetCode, cardA.card_id]
              );
              await query(
                "INSERT INTO solution_set (solution_set_code, card_id) VALUES ($1, $2)",
                [solutionSetCode, cardB.card_id]
              );
              await query(
                "INSERT INTO solution_set (solution_set_code, card_id) VALUES ($1, $2)",
                [solutionSetCode, cardC.card_id]
              );

              processedSetCodes.add(solutionSetCode);
              solutionSetCount++;
              if (solutionSetCount % 100 === 0) {
                console.log(
                  `Found ${solutionSetCount} solution sets so far...`
                );
              }
            }
          }
        }
      }
    }
    console.log(
      `Successfully found and inserted ${solutionSetCount} unique solution sets (each set has 3 rows in solution_set table).`
    );
  } catch (error) {
    console.error("Error seeding solution sets:", error);
  } finally {
    await pool.end();
    console.log("Database connection pool closed.");
  }
}

seedSolutionSets();
