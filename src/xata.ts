// Generated by Xata Codegen 0.30.1. Please do not edit.
import { buildClient } from "@xata.io/client";
import type {
  BaseClientOptions,
  SchemaInference,
  XataRecord,
} from "@xata.io/client";

const tables = [
  {
    name: "events",
    checkConstraints: {},
    foreignKeys: {},
    primaryKey: ["id"],
    uniqueConstraints: {},
    columns: [
      {
        name: "clerkUserId",
        type: "text",
        notNull: true,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "createdAt",
        type: "timestamp without time zone",
        notNull: true,
        unique: false,
        defaultValue: "now()",
        comment: "",
      },
      {
        name: "description",
        type: "text",
        notNull: false,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "durationInMinutes",
        type: "int",
        notNull: true,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "id",
        type: "uuid",
        notNull: true,
        unique: true,
        defaultValue: "gen_random_uuid()",
        comment: "",
      },
      {
        name: "isActive",
        type: "bool",
        notNull: true,
        unique: false,
        defaultValue: "true",
        comment: "",
      },
      {
        name: "name",
        type: "text",
        notNull: true,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "updatedAt",
        type: "timestamp without time zone",
        notNull: true,
        unique: false,
        defaultValue: "now()",
        comment: "",
      },
    ],
  },
  {
    name: "scheduleAvailabilities",
    checkConstraints: {},
    foreignKeys: {
      scheduleAvailabilities_scheduleId_schedules_id_fk: {
        name: "scheduleAvailabilities_scheduleId_schedules_id_fk",
        columns: ["scheduleId"],
        referencedTable: "schedules",
        referencedColumns: ["id"],
        onDelete: "CASCADE",
      },
    },
    primaryKey: ["id"],
    uniqueConstraints: {},
    columns: [
      {
        name: "dayOfWeek",
        type: "bb_633oisv3ih0fp8t3rm1ntb44m4_09pdct.day",
        notNull: true,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "endTime",
        type: "text",
        notNull: true,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "id",
        type: "uuid",
        notNull: true,
        unique: true,
        defaultValue: "gen_random_uuid()",
        comment: "",
      },
      {
        name: "scheduleId",
        type: "link",
        link: { table: "schedules" },
        notNull: true,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "startTime",
        type: "text",
        notNull: true,
        unique: false,
        defaultValue: null,
        comment: "",
      },
    ],
  },
  {
    name: "schedules",
    checkConstraints: {},
    foreignKeys: {},
    primaryKey: ["id"],
    uniqueConstraints: {
      schedules_clerkUserId_unique: {
        name: "schedules_clerkUserId_unique",
        columns: ["clerkUserId"],
      },
    },
    columns: [
      {
        name: "clerkUserId",
        type: "text",
        notNull: true,
        unique: true,
        defaultValue: null,
        comment: "",
      },
      {
        name: "createdAt",
        type: "timestamp without time zone",
        notNull: true,
        unique: false,
        defaultValue: "now()",
        comment: "",
      },
      {
        name: "id",
        type: "uuid",
        notNull: true,
        unique: true,
        defaultValue: "gen_random_uuid()",
        comment: "",
      },
      {
        name: "timezone",
        type: "text",
        notNull: true,
        unique: false,
        defaultValue: null,
        comment: "",
      },
      {
        name: "updatedAt",
        type: "timestamp without time zone",
        notNull: true,
        unique: false,
        defaultValue: "now()",
        comment: "",
      },
    ],
  },
] as const;

export type SchemaTables = typeof tables;
export type InferredTypes = SchemaInference<SchemaTables>;

export type Events = InferredTypes["events"];
export type EventsRecord = Events & XataRecord;

export type ScheduleAvailabilities = InferredTypes["scheduleAvailabilities"];
export type ScheduleAvailabilitiesRecord = ScheduleAvailabilities & XataRecord;

export type Schedules = InferredTypes["schedules"];
export type SchedulesRecord = Schedules & XataRecord;

export type DatabaseSchema = {
  events: EventsRecord;
  scheduleAvailabilities: ScheduleAvailabilitiesRecord;
  schedules: SchedulesRecord;
};

const DatabaseClient = buildClient();

const defaultOptions = {
  databaseURL:
    "https://Raquel-de-Jesus-Fazekas-s-workspace-09pdct.us-east-1.xata.sh/db/clinic",
};

export class XataClient extends DatabaseClient<DatabaseSchema> {
  constructor(options?: BaseClientOptions) {
    super({ ...defaultOptions, ...options }, tables);
  }
}

let instance: XataClient | undefined = undefined;

export const getXataClient = () => {
  if (instance) return instance;

  instance = new XataClient();
  return instance;
};