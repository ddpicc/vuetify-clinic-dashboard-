export default {
  // 上一页
  PRE_PAGE(state, offset) {
    state.offset -= offset
  },
  // 下一页
  NEXT_PAGE(state, offset) {
    state.offset += offset
  },
  GO_PAGE(state, offset) {
    state.offset = offset
  },
}