import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="not-found">
      <h1 className="not-found__title">404</h1>
      <p className="not-found__text">Такой страницы не существует</p>
      <Link href="/" className="not-found__link">
        ← Вернуться к эпизодам
      </Link>
    </div>
  );
}
