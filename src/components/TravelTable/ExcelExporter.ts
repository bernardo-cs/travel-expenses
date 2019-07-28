import { i18n } from "./../../main";
import XLSX from "xlsx";
import { saveAs } from "file-saver";
import { dailyExpenses } from "./DayExpenses";
import { IRow, TypeOfWorker } from "./TraveTable.interfaces";

export function downloadToExcel(
  { rows, total }: { rows: Array<IRow>; total: number },
  { workerType, date }: { workerType: TypeOfWorker; date: Date }
) {
  const wb = XLSX.utils.book_new();

  const ws = XLSX.utils.aoa_to_sheet([
    [
      i18n.t("day"),
      i18n.t("service"),
      i18n.t("departure"),
      i18n.t("arrival"),
      i18n.t("sleepOver"),
      i18n.t("outsidecountry"),
      i18n.t("compensation")
    ],
    ...storeRowsToExcelRows(rows, workerType),
    ["Total", "", "", "", "", "", total]
  ]);

  const sheetName = i18n.d(date, "monthWithYear");
  wb.SheetNames.push(sheetName);
  wb.Sheets[sheetName] = ws;

  wb.Props = {
    Title: `${i18n.t("excel.title")} ${i18n.d(date, "monthWithYear")}`,
    Subject: "",
    Author: "Bernardo Simões",
    CreatedDate: new Date()
  };
  var wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

  saveAs(
    new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
    `${i18n.t("excel.fileName")}_${i18n.d(
      date,
      "month"
    )}_${date.getFullYear()}.xlsx`
  );
}

function s2ab(s: any) {
  const buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
  const view = new Uint8Array(buf); //create uint8array as viewer
  for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff; //convert to octet
  return buf;
}

function storeRowsToExcelRows(
  rows: Array<IRow>,
  workerType: TypeOfWorker
): Array<any> {
  return rows.map(row => {
    const outsideCountry = row.outsideCountry ? "outside" : "inside";

    const dailyRemoneration = dailyExpenses(
      row.arrival,
      row.departure,
      row.sleepOver,
      outsideCountry,
      workerType
    );

    return [
      i18n.d(row.day, "weekWithDay"),
      row.service,
      row.departure,
      row.arrival,
      row.sleepOver,
      row.outsideCountry,
      dailyRemoneration
    ];
  });
}
