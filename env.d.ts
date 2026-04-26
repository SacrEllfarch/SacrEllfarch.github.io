declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  export interface SakuraImageCardProps {
    [key: string]: unknown
  }

  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}
