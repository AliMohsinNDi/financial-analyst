import io
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import pandas as pd
import matplotlib.pyplot as plt
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch

app = FastAPI(title="Report Generation Agent")

class ReportPayload(BaseModel):
    ticker: str
    analysis: dict
    daily: dict

def generate_price_chart(daily_data: dict, output_buffer: io.BytesIO):
    """Generates a PNG of the historical price chart and writes it to the buffer."""
    try:
        daily_series = daily_data.get("Time Series (Daily)")
        if not daily_series:
            raise ValueError("Missing 'Time Series (Daily)' data.")
            
        df = pd.DataFrame.from_dict(daily_series, orient="index").astype(float)
        df.index = pd.to_datetime(df.index)
        df = df.sort_index()

        plt.style.use('seaborn-v0_8-darkgrid')
        fig, ax = plt.subplots(figsize=(7, 3.5))
        ax.plot(df.index, df["4. close"], color="cyan", linewidth=2)
        ax.set_title(f"Historical Close Price (Last 100 Days)", fontsize=14)
        ax.set_xlabel("Date", fontsize=10)
        ax.set_ylabel("Price (USD)", fontsize=10)
        plt.xticks(rotation=45)
        plt.tight_layout()
        
        plt.savefig(output_buffer, format='png', dpi=150)
        plt.close(fig)
        output_buffer.seek(0)
    except Exception as e:
        print(f"Error generating chart: {e}")
        raise

def build_pdf(payload: ReportPayload) -> io.BytesIO:
    """Constructs the PDF report from the analysis data."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize="letter")
    styles = getSampleStyleSheet()
    
    elements = []
    
    # Title
    elements.append(Paragraph(f"AI-Generated Financial Report: {payload.ticker.upper()}", styles['h1']))
    elements.append(Spacer(1, 0.25 * inch))
    
    # Key Metrics
    elements.append(Paragraph("Key Analysis Metrics", styles['h2']))
    metrics = payload.analysis
    for key, value in metrics.items():
        if isinstance(value, float):
            text = f"<b>{key.replace('_', ' ').title()}:</b> {value:.2f}"
        else:
            text = f"<b>{key.replace('_', ' ').title()}:</b> {value}"
        elements.append(Paragraph(text, styles['Normal']))
    elements.append(Spacer(1, 0.2 * inch))

    # Price Chart
    chart_buffer = io.BytesIO()
    try:
        generate_price_chart(payload.daily, chart_buffer)
        elements.append(Paragraph("Historical Price Chart", styles['h2']))
        elements.append(Image(chart_buffer, width=7*inch, height=3.5*inch))
    except Exception as e:
        elements.append(Paragraph(f"Could not generate chart: {e}", styles['Normal']))
    
    doc.build(elements)
    buffer.seek(0)
    return buffer

@app.post("/report")
async def generate_report(payload: ReportPayload):
    try:
        pdf_buffer = build_pdf(payload)
        filename = f"{payload.ticker}_financial_report.pdf"
        headers = {'Content-Disposition': f'attachment; filename="{filename}"'}
        return StreamingResponse(pdf_buffer, media_type="application/pdf", headers=headers)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate report: {e}") 