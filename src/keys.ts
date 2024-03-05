import { PrivateKey } from 'openpgp'
import { type InjectionKey, type Ref } from 'vue'

export const privateKeySymbol = Symbol() as InjectionKey<
  | {
      privateKey: Ref<PrivateKey | undefined>
      updatePrivateKey: (pkey: PrivateKey | undefined) => void
    }
  | undefined
>
