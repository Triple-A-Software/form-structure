import {
	array,
	boolean,
	discriminatedUnion,
	literal,
	number,
	object,
	optional,
	type output,
	record,
	string,
	union,
	unknown,
	enum as zodEnum,
	type inferFormattedError,
} from "zod";

const itemCommonOptions = {
	description: optional(string()),
	label: record(string()),
	defaultValue: optional(unknown()),
	hint: optional(string()),
	id: string(),
};

const TextareaItem = object({
	type: literal("textarea"),
	...itemCommonOptions,
});
const TextItem = object({
	type: literal("text"),
	...itemCommonOptions,
});
const NumberItem = object({
	type: literal("number"),
	...itemCommonOptions,
	min: optional(number()),
	max: optional(number()),
	step: optional(number()),
});
const CheckboxItem = object({
	type: literal("checkbox"),
	...itemCommonOptions,
});
const SelectItem = object({
	type: literal("select"),
	multiple: boolean().optional(),
	dataType: zodEnum(["string", "number"]),
	...itemCommonOptions,
	options: array(
		object({
			label: record(string()),
			value: union([string(), number()]),
		}),
	),
});
const CodeItem = object({
	type: literal("code"),
	...itemCommonOptions,

	language: zodEnum(["js", "css", "html", "json"]),
});
const RangeItem = object({
	type: literal("range"),
	...itemCommonOptions,
	min: number(),
	max: number(),
	step: optional(number()),
});
const ButtongroupItem = object({
	type: literal("buttongroup"),
	...itemCommonOptions,
	options: array(
		object({
			label: record(string()),
			value: string(),
		}),
	),
});
const RelationItem = object({
	type: literal("relation"),
	...itemCommonOptions,
	relationName: zodEnum(["page", "user", "file"]),
	multiple: optional(boolean()),
});

const SimpleItem = discriminatedUnion("type", [
	TextareaItem,
	TextItem,
	NumberItem,
	CheckboxItem,
	SelectItem,
	CodeItem,
	RangeItem,
	ButtongroupItem,
	RelationItem,
]);

export type SimpleItemOutput = output<typeof SimpleItem>;

const AccordionItem = object({
	type: literal("accordion"),
	...itemCommonOptions,
	items: array(
		object({
			label: record(string()),
			icon: string().optional(),
			id: string(),
			description: record(string()),
			properties: array(SimpleItem),
		}),
	),
});

const KeyValueItem = object({
	type: literal("key-value"),
	key: SimpleItem,
	value: SimpleItem,
	...itemCommonOptions,
});
const Item = discriminatedUnion("type", [
	KeyValueItem,
	TextareaItem,
	TextItem,
	NumberItem,
	CheckboxItem,
	SelectItem,
	CodeItem,
	RangeItem,
	ButtongroupItem,
	RelationItem,
	AccordionItem,
]);
export type ItemOutput = output<typeof Item>;

export const Schema = object({
	title: optional(string()),
	required: optional(array(string())),
	properties: array(Item),
	description: optional(string()),
	showDataKey: optional(string()),
	label: record(string()),
});

export type SchemaOutput = output<typeof Schema>;
export type SchemaFormattedError = inferFormattedError<typeof Schema>;

export function validateForm(form: unknown) {
	return Schema.parse(form);
}