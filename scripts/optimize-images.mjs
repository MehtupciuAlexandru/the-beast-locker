import fs from "fs";
import path from "path";
import sharp from "sharp";

const inputDir = path.join(process.cwd(), "image-input");
const outputDir = path.join(process.cwd(), "image-output");

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

const files = fs.readdirSync(inputDir).filter((file) =>
    allowedExtensions.includes(path.extname(file).toLowerCase())
);

for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const parsed = path.parse(file);
    const outputPath = path.join(outputDir, `${parsed.name}.jpg`);

    await sharp(inputPath)
        .rotate()
        .resize({
            width: 1800,
            withoutEnlargement: true,
        })
        .jpeg({
            quality: 82,
            mozjpeg: true,
        })
        .toFile(outputPath);

    const originalSize = fs.statSync(inputPath).size / 1024 / 1024;
    const optimizedSize = fs.statSync(outputPath).size / 1024 / 1024;

    console.log(`${file}: ${originalSize.toFixed(2)}MB -> ${optimizedSize.toFixed(2)}MB`);
}