import Link from 'next/link';

export default function ComingSoon({ title, text }) {
  return (
    <div className="container" style={{ padding: '96px 24px', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start', maxWidth: 720 }}>
      <span className="chip chip-brand kicker">Muy pronto</span>
      <h1 className="h2">{title}</h1>
      <p className="muted" style={{ margin: 0, fontSize: 16, lineHeight: '24px' }}>{text}</p>
      <Link href="/vende" className="btn btn-primary">Mientras tanto, cotiza tu auto</Link>
    </div>
  );
}
