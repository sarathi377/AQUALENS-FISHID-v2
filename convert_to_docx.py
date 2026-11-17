import re
from docx import Document
from docx.shared import Pt, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH

def create_docx(markdown_path, docx_path):
    doc = Document()
    
    # Set default font
    style = doc.styles['Normal']
    font = style.font
    font.name = 'Times New Roman'
    font.size = Pt(10)

    with open(markdown_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    title_reached = False
    in_table = False
    table_data = []

    for line in lines:
        line = line.strip()
        if not line and not in_table:
            continue

        # Header 1 (Title)
        if line.startswith('# '):
            title = line[2:]
            p = doc.add_heading(title, 0)
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            title_reached = True
            continue

        # Authors/Details
        if not title_reached and line:
            p = doc.add_paragraph(line)
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            continue

        # Header 3
        if line.startswith('### '):
            doc.add_heading(line[4:], level=1)
            continue

        # Header 4
        if line.startswith('#### '):
            doc.add_heading(line[5:], level=2)
            continue

        # Table detection
        if line.startswith('|'):
            if '---' in line:
                continue
            in_table = True
            cells = [cell.strip().replace('**', '') for cell in line.split('|')[1:-1]]
            table_data.append(cells)
            continue
        elif in_table:
            # Table finished
            table = doc.add_table(rows=len(table_data), cols=len(table_data[0]))
            table.style = 'Table Grid'
            for i, row in enumerate(table_data):
                for j, val in enumerate(row):
                    table.cell(i, j).text = val
            table_data = []
            in_table = False
            continue

        # Paragraphs and Lists
        if line.startswith('• ') or line.startswith('* ') or re.match(r'^\d+\.', line):
            p = doc.add_paragraph(line, style='List Bullet' if '•' in line or '*' in line else 'List Number')
        else:
            # Handle basic bold/italic
            p = doc.add_paragraph()
            parts = re.split(r'(\*\*.*?\*\*|\*.*?\*)', line)
            for part in parts:
                if part.startswith('**') and part.endswith('**'):
                    p.add_run(part[2:-2]).bold = True
                elif part.startswith('*') and part.endswith('*'):
                    p.add_run(part[1:-1]).italic = True
                else:
                    p.add_run(part)

    doc.save(docx_path)

if __name__ == "__main__":
    create_docx('fish_species_identification_paper.md', 'fish_species_identification_paper.docx')
