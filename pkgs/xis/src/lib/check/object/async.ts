import type { XisIssueBase } from "#core/error.js"
import type { Xis } from "#core/kernel.js"
import type { BaseObject } from "#util/base-type.js"

export type XisSyncPropsSchema<In extends BaseObject> = {
	-readonly [K in keyof In]-?: Xis<Exclude<In[K], undefined>, XisIssueBase, unknown, any>
}
