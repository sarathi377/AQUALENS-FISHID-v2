import re
import os
from docx import Document
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

def set_cell_background(cell, fill_color):
    tcPr = cell._element.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), fill_color)
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._element.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def build_journal_docx(markdown_path, docx_path):
    doc = Document()

    # Page Margins (0.75 in standard IEEE / Elsevier)
    for section in doc.sections:
        section.top_margin = Inches(0.75)
        section.bottom_margin = Inches(0.75)
        section.left_margin = Inches(0.75)
        section.right_margin = Inches(0.75)

    # Base Normal Style
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Times New Roman'
    normal_style.font.size = Pt(10)
    normal_style.font.color.rgb = RGBColor(0x1F, 0x24, 0x21)

    with open(markdown_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    in_table = False
    table_data = []

    for line in lines:
        raw_line = line.strip()

        # Handle Tables
        if raw_line.startswith('|'):
            if '---' in raw_line:
                continue
            in_table = True
            cells = [c.strip() for c in raw_line.split('|')[1:-1]]
            table_data.append(cells)
            continue
        elif in_table:
            # Table closing
            if table_data and len(table_data) > 0 and len(table_data[0]) > 0:
                cols = len(table_data[0])
                table = doc.add_table(rows=len(table_data), cols=cols)
                table.alignment = WD_TABLE_ALIGNMENT.CENTER
                table.style = 'Table Grid'

                for r_idx, row in enumerate(table_data):
                    for c_idx, val in enumerate(row):
                        if c_idx < cols:
                            cell = table.cell(r_idx, c_idx)
                            cell.text = val.replace('**', '').replace('*', '')
                            set_cell_margins(cell, top=80, bottom=80, left=120, right=120)

                            # Style Header Row
                            if r_idx == 0:
                                set_cell_background(cell, "EAECEE")
                                for p in cell.paragraphs:
                                    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
                                    for run in p.runs:
                                        run.font.bold = True
                                        run.font.size = Pt(8.5)
                            else:
                                for p in cell.paragraphs:
                                    for run in p.runs:
                                        run.font.size = Pt(8.5)
                doc.add_paragraph() # spacing
            table_data = []
            in_table = False

        if not raw_line:
            continue

        if raw_line == '---':
            continue

        # Title (# )
        if raw_line.startswith('# '):
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_before = Pt(12)
            p.paragraph_format.space_after = Pt(12)
            run = p.add_run(raw_line[2:])
            run.font.name = 'Times New Roman'
            run.font.size = Pt(18)
            run.font.bold = True
            run.font.color.rgb = RGBColor(0x0C, 0x23, 0x40)
            continue

        # Authors / Affiliation
        if raw_line.startswith('**Keerthasarathi') or raw_line.startswith('*Department') or raw_line.startswith('*Alpha X'):
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_after = Pt(4)
            clean_text = raw_line.replace('**', '').replace('*', '').replace('$^{1}$', '')
            run = p.add_run(clean_text)
            run.font.name = 'Times New Roman'
            run.font.size = Pt(9.5)
            if 'Keerthasarathi' in clean_text:
                run.font.bold = True
            else:
                run.font.italic = True
            continue

        # Major Headings (## I., ## II., etc.)
        if raw_line.startswith('## '):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(14)
            p.paragraph_format.space_after = Pt(4)
            p.paragraph_format.keep_with_next = True
            heading_text = raw_line[3:].upper()
            run = p.add_run(heading_text)
            run.font.name = 'Times New Roman'
            run.font.size = Pt(11)
            run.font.bold = True
            run.font.color.rgb = RGBColor(0x0C, 0x23, 0x40)
            continue

        # Sub Headings (### A., ### 1., etc.)
        if raw_line.startswith('### '):
            p = doc.add_paragraph()
            p.paragraph_format.space_before = Pt(8)
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.keep_with_next = True
            sub_text = raw_line[4:]
            run = p.add_run(sub_text)
            run.font.name = 'Times New Roman'
            run.font.size = Pt(10)
            run.font.bold = True
            run.font.italic = True
            continue

        # Bullet items
        if raw_line.startswith('* ') or raw_line.startswith('- '):
            p = doc.add_paragraph(style='List Bullet')
            p.paragraph_format.space_after = Pt(2)
            content = raw_line[2:]
            # formatting
            parts = re.split(r'(\*\*.*?\*\*|\*.*?\*)', content)
            for part in parts:
                if part.startswith('**') and part.endswith('**'):
                    p.add_run(part[2:-2]).bold = True
                elif part.startswith('*') and part.endswith('*'):
                    p.add_run(part[1:-1]).italic = True
                else:
                    p.add_run(part)
            continue

        # Standard Paragraphs
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.line_spacing = 1.12
        parts = re.split(r'(\*\*.*?\*\*|\*.*?\*)', raw_line)
        for part in parts:
            if part.startswith('**') and part.endswith('**'):
                p.add_run(part[2:-2]).bold = True
            elif part.startswith('*') and part.endswith('*'):
                p.add_run(part[1:-1]).italic = True
            else:
                p.add_run(part)

    doc.save(docx_path)
    print(f"Successfully generated academic DOCX: {docx_path}")

if __name__ == "__main__":
    src_md = 'docs/JOURNAL_RESEARCH_PAPER.md'
    dest_docx = 'docs/AquaLens_Journal_Paper_IEEE.docx'
    build_journal_docx(src_md, dest_docx)
