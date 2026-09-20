export function ErrorMessage({ message }: { message: string | null }) {
  if (!message) return null
  return <p className="error-message">{message}</p>
}
