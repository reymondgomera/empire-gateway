export function sliceIntoChunks<TData>(arr: TData[], chunkSize: number) {
  const res: TData[] = []
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize) as unknown as TData
    res.push(chunk)
  }
  return res
}
