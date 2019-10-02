import { Module, VuexModule, Mutation } from "vuex-module-decorators";
import {
  IRow,
  TypeOfWorker
} from "@/components/TravelTable/TraveTable.interfaces";
import moment from "moment";
import { dailyExpenses } from "@/components/TravelTable/DayExpenses";
import { i18n } from "@/main";

const ROWS_FORMAT = "MM-YYYY";

@Module({ name: "TravelTableModule" })
export class TravelTableModule extends VuexModule {
  _date: Date = moment()
    .set("date", 1)
    .toDate();
  _rowsByMonth: { [k: string]: Array<IRow> } = {
    [moment()
      .set("date", 1)
      .format(ROWS_FORMAT)]: initRows(
      moment()
        .set("date", 1)
        .toDate()
    )
  };
  _workerType: TypeOfWorker = "directors";

  get date() {
    return this._date;
  }

  get rowsByMonth() {
    return this._rowsByMonth;
  }

  get workerType() {
    return this._workerType;
  }

  get currentMonth() {
    return moment(this._date).format(ROWS_FORMAT);
  }

  get rows() {
    return this._rowsByMonth[this.currentMonth];
  }

  get daysInMonth() {
    return moment(this._date).daysInMonth();
  }

  get total() {
    return this.rows.reduce((acc: number, row: IRow) => {
      const countryTravel = row.outsideCountry ? "outside" : "inside";
      const expense = dailyExpenses(
        row.arrival,
        row.departure,
        row.sleepOver,
        countryTravel,
        this._workerType
      );

      return acc + expense;
    }, 0);
  }

  @Mutation
  setDate(date: string | Date) {
    const d = date instanceof Date ? date : new Date(date);

    this._date = moment(d)
      .set("d", 1)
      .toDate();

    currentMonthRows(this);
  }

  @Mutation
  setService(payload: { index: number; service: string }) {
    const rows = currentMonthRows(this);
    rows[payload.index].service = payload.service;
  }

  @Mutation
  clearRows() {
    const rows = currentMonthRows(this);

    rows.forEach(row => {
      row.departure = undefined;
      row.arrival = undefined;
      row.service = "";
      row.sleepOver = false;
      row.outsideCountry = false;
    });
  }

  @Mutation
  clearRow(index: number) {
    const rows = currentMonthRows(this);

    rows[index].departure = undefined;
    rows[index].arrival = undefined;
    rows[index].service = "";
    rows[index].sleepOver = false;
    rows[index].outsideCountry = false;
  }

  @Mutation
  setDeparture({ index, date }: { index: number; date: Date }) {
    const rows = currentMonthRows(this);
    rows[index].departure = date;
  }

  @Mutation
  setArrival({ index, date }: { index: number; date: Date }) {
    const rows = currentMonthRows(this);
    rows[index].arrival = date;
  }

  @Mutation
  autoFillRow(index: number) {
    const rows = currentMonthRows(this);
    const ser = i18n.t("defaultServiceDescription") as string;

    rows[index].service = ser;
    rows[index].outsideCountry = false;
    rows[index].sleepOver = false;
    rows[index].departure = moment(rows[index].day)
      .startOf("day")
      .set("hour", 9)
      .toDate();
    rows[index].arrival = moment(rows[index].day)
      .startOf("day")
      .set("hour", 18)
      .toDate();
  }

  @Mutation
  autoFillRows() {
    this._rowsByMonth[moment(this._date).format(ROWS_FORMAT)] = autoFillRows(
      this._date
    );
  }

  @Mutation
  setSleepOver({ index, value }: { index: number; value: boolean }) {
    const rows = currentMonthRows(this);
    rows[index].sleepOver = value;
  }

  @Mutation
  setOutsideCountry({ index, value }: { index: number; value: boolean }) {
    const rows = currentMonthRows(this);
    rows[index].outsideCountry = value;
  }

  @Mutation
  setWorkerType(workerType: TypeOfWorker) {
    this._workerType = workerType;
  }
}

function currentMonthRows(state: TravelTableModule): Array<IRow> {
  if (state._rowsByMonth[moment(state._date).format(ROWS_FORMAT)]) {
    return state._rowsByMonth[moment(state._date).format(ROWS_FORMAT)];
  } else {
    const r = initRows(state._date);
    state._rowsByMonth[moment(state._date).format(ROWS_FORMAT)] = r;

    return r;
  }
}

function initRows(date: Date): Array<IRow> {
  return Array.from({ length: moment(date).daysInMonth() }, (_, index) => {
    const day = moment(date).set("date", 1 + index);

    return {
      day: day.toDate(),
      service: "",
      sleepOver: false,
      outsideCountry: false,
      departure: undefined,
      arrival: undefined
    };
  });
}

function autoFillRows(date: Date): Array<IRow> {
  return Array.from({ length: moment(date).daysInMonth() }, (_, index) => {
    return autoFillRow(index, date);
  });
}

function autoFillRow(index: number, date: Date): IRow {
  const day = moment(date).set("date", 1 + index);
  const service = i18n.t("defaultServiceDescription") as string;

  return [0, 6].includes(day.day())
    ? {
        day: day.toDate(),
        service: "",
        sleepOver: false,
        outsideCountry: false,
        departure: undefined,
        arrival: undefined
      }
    : {
        day: day.toDate(),
        service,
        outsideCountry: false,
        sleepOver: false,
        departure: day
          .startOf("day")
          .set("hour", 9)
          .toDate(),
        arrival: day
          .startOf("day")
          .set("hour", 18)
          .toDate()
      };
}
