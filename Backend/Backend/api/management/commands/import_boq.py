import pandas as pd
import re
import numpy as np
from django.core.management.base import BaseCommand
from api.models import BOQBill, BOQ


class Command(BaseCommand):
    help = "FINAL ROBUST BOQ IMPORTER (Excel safe)"

    # -------------------------
    # SAFE CLEANERS
    # -------------------------
    def clean(self, val):
        if val is None:
            return None
        if isinstance(val, float) and np.isnan(val):
            return None
        if pd.isna(val):
            return None
        return str(val).strip()

    def to_int(self, val):
        try:
            if pd.isna(val):
                return 0
            return int(float(val))
        except:
            return 0

    def to_float(self, val):
        try:
            if val is None or pd.isna(val) or str(val).lower() == "nan":
                return 0
            return float(val)
        except:
            return 0

    # -------------------------
    # FIND HEADER ROW SAFE
    # -------------------------
    def find_header_row(self, df):
        for i in range(len(df)):
            row = df.iloc[i].astype(str).fillna("").tolist()
            text = " ".join(row).lower()

            if "description" in text and ("qty" in text or "quantity" in text):
                return i

        return None

    # -------------------------
    # CHECK VALID SHEET
    # -------------------------
    def is_valid_sheet(self, df):
        sample = df.head(5).astype(str).fillna("").to_string().lower()
        return "description" in sample and ("qty" in sample or "quantity" in sample)

    # -------------------------
    # MAIN
    # -------------------------
    def handle(self, *args, **kwargs):

        file_path = "api/data/boq1.xlsx"
        xls = pd.ExcelFile(file_path)

        self.stdout.write(self.style.SUCCESS(f"Sheets found: {xls.sheet_names}"))

        total_bills = 0
        total_items = 0

        for sheet_name in xls.sheet_names:

            df = pd.read_excel(xls, sheet_name=sheet_name, header=None)

            # skip junk sheets
            if not self.is_valid_sheet(df):
                continue

            self.stdout.write(f"\nProcessing sheet: {sheet_name}")

            header_row = self.find_header_row(df)
            if header_row is None:
                continue

            df = pd.read_excel(xls, sheet_name=sheet_name, header=header_row)
            df.columns = df.columns.astype(str).str.strip()

            current_bill = None

            for _, row in df.iterrows():

                first = str(row.iloc[0])

                # -----------------------
                # DETECT BILL HEADER
                # -----------------------
                match = re.search(r"Bill\s*No\.?\s*(\d+)", first, re.I)

                if match:
                    bill_no = int(match.group(1))

                    current_bill = BOQBill.objects.create(
                        bill_no=bill_no,
                        bill_title=first[:200],
                        qty=0,
                        unit_rate_rs=0,
                    )

                    total_bills += 1
                    continue

                if not current_bill:
                    continue

                # -----------------------
                # CREATE BOQ ITEM
                # -----------------------
                BOQ.objects.create(
                    bill=current_bill,
                    item_no=self.to_int(row.get("Sr. No") or row.get("Sr, No") or 0),
                    mrs_ref_no=self.clean(row.get("MRS Ref. #")),
                    item_description=self.clean(row.get("Description")),
                    unit=self.clean(row.get("Unit")),
                    quantity=self.to_float(row.get("Qty") or row.get("Qty.")),
                    rate_rs=self.to_float(row.get("Unit Rate (PKR)") or row.get("Unit Rate (Rs.)")),
                )

                total_items += 1

        self.stdout.write(self.style.SUCCESS(
            f"\nDONE ✔ Bills: {total_bills}, Items: {total_items}"
        ))