import { Codec, exactly, nonEmptyList, oneOf, string } from "purify-ts/Codec"

const messageCodec = Codec.interface({
	content: string,
	role: oneOf([exactly("user"), exactly("assistant")]),
})

const messagesCodec = nonEmptyList(messageCodec)

export { messageCodec, messagesCodec }
