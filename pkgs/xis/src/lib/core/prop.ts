export type MessageBuilder = (...args: Array<any>) => string

export interface XisProps<Nullable extends boolean> {
	nullable: Nullable
	messages?: Record<string, string | MessageBuilder>
}

export type XisPropsBase = XisProps<boolean>
