import math
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from PIL import Image, ImageOps, ImageFilter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.utils import ImageReader
from datetime import datetime
import io
import time

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate-stencil/")
async def generate_stencil(
    file: UploadFile = File(...),
    target_width_cm: float = Form(...),
    target_height_cm: float = Form(...),
    filter_type: str = Form(...),
    orientation: str = Form("portrait")
):
    if not file.content_type.startswith("image/"):
        return {"error": "File is not an image."}

    try:
        # Page dimensions based on orientation
        if orientation == "landscape":
            pagesize = landscape(A4)
            a4_w_cm, a4_h_cm = 29.7, 21.0
        else:
            pagesize = A4
            a4_w_cm, a4_h_cm = 21.0, 29.7
        
        a4_w_pt, a4_h_pt = pagesize

        # DPI for high quality
        DPI = 300
        pt_to_px = DPI / 72.0

        a4_w_px = int(a4_w_pt * pt_to_px)
        a4_h_px = int(a4_h_pt * pt_to_px)

        img = Image.open(file.file)

        

        if filter_type == "bw":
            img = ImageOps.grayscale(img).convert("RGB") # Keep it RGB for color padding
        elif filter_type == "outline":
            # 1. Convert to grayscale and find edges
            img = img.convert("L").filter(ImageFilter.FIND_EDGES)
            # 2. Invert the colors (White edges on Black -> Black edges on White)
            img = ImageOps.invert(img)
            # 3. Convert to RGB if you need to maintain consistency with other filters
            img = img.convert("RGB")

        # Calculate grid size
        cols = math.ceil(target_width_cm / a4_w_cm)
        rows = math.ceil(target_height_cm / a4_h_cm)

        # Total dimensions in pixels for the final assembled image
        total_w_px = cols * a4_w_px
        total_h_px = rows * a4_h_px

        # Resize and pad the original image to fit the total dimensions, allowing upscaling
        img_copy = img.copy()
        
        img_ratio = img_copy.width / img_copy.height
        target_ratio = total_w_px / total_h_px

        if img_ratio > target_ratio:
            # Image is wider than target, fit to width
            new_w = total_w_px
            new_h = int(new_w / img_ratio)
        else:
            # Image is taller or same ratio, fit to height
            new_h = total_h_px
            new_w = int(new_h * img_ratio)

        resized_img = img_copy.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        padded_img = Image.new("RGB", (total_w_px, total_h_px), "white")
        
        paste_x = (total_w_px - resized_img.width) // 2
        paste_y = (total_h_px - resized_img.height) // 2
        padded_img.paste(resized_img, (paste_x, paste_y))
        
        pdf_buffer = io.BytesIO()
        c = canvas.Canvas(pdf_buffer, pagesize=pagesize)

        for r in range(rows):
            for col in range(cols):
                left = col * a4_w_px
                top = r * a4_h_px
                right = left + a4_w_px
                bottom = top + a4_h_px

                tile = padded_img.crop((left, top, right, bottom))
                tile_buffer = io.BytesIO()
                tile.save(tile_buffer, format="PNG")
                tile_buffer.seek(0)

                c.drawImage(ImageReader(tile_buffer), 0, 0, width=a4_w_pt, height=a4_h_pt)
                c.showPage()
        c.save()
        pdf_buffer.seek(0)

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"stencil_{timestamp}.pdf"

        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )

    except Exception as e:
        return {"error": str(e)}

    finally:
        file.file.close()