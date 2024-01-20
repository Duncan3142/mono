export type MessageBuilder = (...args: Array<any>) => string

export type BaseMessages = Record<string, string | MessageBuilder>

export interface XisProps<Messages extends BaseMessages> {
	messages?: Messages
}

export type XisPropsBase = XisProps<BaseMessages>
