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
	hint: optional(record(string())),
	id: string(),
};

const RichText = object({
	type: literal("richtext"),
	...itemCommonOptions,
});
const Markdown = object({
	type: literal("markdown"),
	...itemCommonOptions,
});
const Textarea = object({
	type: literal("textarea"),
	...itemCommonOptions,
});
const Text = object({
	type: literal("text"),
	...itemCommonOptions,
});
const PasswordInput = object({
	type: literal("password"),
	...itemCommonOptions,
});
const NumberInput = object({
	type: literal("number"),
	...itemCommonOptions,
	min: optional(number()),
	max: optional(number()),
	step: optional(number()),
});
const Checkbox = object({
	type: literal("checkbox"),
	...itemCommonOptions,
});
const Select = object({
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
const Code = object({
	type: literal("code"),
	...itemCommonOptions,

	language: zodEnum(["js", "css", "html", "json"]),
});
const Range = object({
	type: literal("range"),
	...itemCommonOptions,
	min: number(),
	max: number(),
	step: optional(number()),
});
const Buttongroup = object({
	type: literal("buttongroup"),
	...itemCommonOptions,
	options: array(
		object({
			label: record(string()),
			value: string(),
		}),
	),
});
const Relation = object({
	type: literal("relation"),
	...itemCommonOptions,
	mimeTypes: array(string()).optional(),
	relationName: zodEnum(["page", "user", "file", "post", "tag", "event"]),
	multiple: optional(boolean()),
});
const RelationRules = object({
	type: literal("relationRules"),
	...itemCommonOptions,
	relationName: zodEnum(["page", "user", "file", "post", "tag", "event"]),
});
const PluginData = object({
	type: literal("pluginData"),
	...itemCommonOptions,
	pluginId: string(),
	filterByKey: string().optional(),
	labelKey: string(),
	valueKey: string(),
});

const simpleInputs = [
	Textarea,
	Text,
	PasswordInput,
	NumberInput,
	Checkbox,
	Select,
	Code,
	Range,
	Buttongroup,
	Relation,
	RelationRules,
	RichText,
	Markdown,
	PluginData,
] as const;
const SimpleInput = discriminatedUnion("type", [...simpleInputs]);

export type SimpleItemOutput = output<typeof SimpleInput>;

const AccordionItem = object({
	label: record(string()),
	icon: string().optional(),
	id: string(),
	description: record(string()),
	properties: array(SimpleInput),
});
const Accordion = object({
	type: literal("accordion"),
	...itemCommonOptions,
	items: array(AccordionItem),
});
export const BuilderItem = object({
	icon: string().optional(),
	name: string(),
	props: array(SimpleInput), // Maybe we want to support all items here in the future?
	data: record(any()),
	label: record(string()),
}).passthrough();
export const Builder = object({
	type: literal("builder"),
	items: array(BuilderItem),
	previewTemplate: string().optional(),
	...itemCommonOptions,
});
const KeyValue = object({
	type: literal("key-value"),
	key: SimpleInput,
	value: SimpleInput,
	...itemCommonOptions,
});
const Input = discriminatedUnion("type", [
	...simpleInputs,
	KeyValue,
	Builder,
	Accordion,
]);
export type ItemOutput = output<typeof Input>;

export const Schema = object({
	title: optional(string()),
	required: optional(array(string())),
	properties: array(Input),
	description: optional(string()),
	showDataKey: optional(string()),
	label: record(string()),
});

export type SchemaOutput = output<typeof Schema>;
export type SchemaFormattedError = inferFormattedError<typeof Schema>;

export function validateForm(form: unknown) {
	return Schema.parse(form);
}
