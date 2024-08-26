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
	any,
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

const RichTextItem = object({
	type: literal("richtext"),
	...itemCommonOptions,
});
const MarkdownItem = object({
	type: literal("markdown"),
	...itemCommonOptions,
});
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
	).or(string()),
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
	relationName: zodEnum(["page", "user", "file", "post", "tag"]),
	multiple: optional(boolean()),
});
const RelationRulesItem = object({
	type: literal("relationRules"),
	...itemCommonOptions,
	relationName: zodEnum(["page", "user", "file", "post", "tag"]),
});
const PluginDataItem = object({
	type: literal("pluginData"),
	...itemCommonOptions,
	pluginId: string(),
	filterByKey: string().optional(),
	labelKey: string(),
	valueKey: string(),
});

const simpleItems = [
	TextareaItem,
	TextItem,
	NumberItem,
	CheckboxItem,
	SelectItem,
	CodeItem,
	RangeItem,
	ButtongroupItem,
	RelationItem,
	RelationRulesItem,
	RichTextItem,
	MarkdownItem,
	PluginDataItem,
] as const;
const SimpleItem = discriminatedUnion("type", [...simpleItems]);

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
const BuilderItem = object({
	type: literal("builder"),
	items: array(record(string(), any())),
	previewTemplate: string().optional(),
	...itemCommonOptions,
});
const KeyValueItem = object({
	type: literal("key-value"),
	key: SimpleItem,
	value: SimpleItem,
	...itemCommonOptions,
});
const Item = discriminatedUnion("type", [
	...simpleItems,
	KeyValueItem,
	BuilderItem,
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
