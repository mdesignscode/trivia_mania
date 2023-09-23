/* Instruments */
import type { ReduxState } from '@/lib/redux'

export const progressSelector = (state: ReduxState) => state.progress
