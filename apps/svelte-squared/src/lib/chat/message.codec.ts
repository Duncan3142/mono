import { Codec, exactly, nonEmptyList, number, oneOf, string } from "purify-ts/Codec"

const messageCodec = Codec.interface({
	content: string,
	role: oneOf([exactly("user"), exactly("assistant")]),
	timestamp: number,
})

const messagesCodec = nonEmptyList(messageCodec)

export { messageCodec, messagesCodec }
