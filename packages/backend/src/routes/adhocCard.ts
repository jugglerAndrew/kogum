import express, { Request, Response } from "express";
import { getSvgEntityData } from "../db/svgEntity";

const router = express.Router();

// GET /api/adhoc-card?shape=...&fill=...&color=...&count=...
router.get("/adhoc-card", async (req: Request, res: Response) => {
  const { shape, fill, color, count } = req.query;
  if (!shape || !fill || !color || !count) {
    res.status(400).json({ error: "Missing required parameters." });
    return;
  }
  const svgData = await getSvgEntityData();
  const shapeData = svgData.shapes[String(shape).toUpperCase()];
  const fillData = svgData.fills[String(fill).toUpperCase()];
  const colorData = svgData.colors[String(color).toUpperCase()];

  if (!shapeData || !fillData || !colorData) {
    res.status(404).json({ error: "Shape, fill, or color not found." });
    return;
  }

  res.json({
    svgType: shapeData.svg_type,
    svgProps: shapeData.svg_properties,
    fillType: fillData.fill_name,
    color: colorData.color_code || colorData.color_name,
    svgPattern: fillData.svg_pattern,
    count: Number(count),
  });
});

export default router;
