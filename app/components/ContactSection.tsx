export function ContactSection() {
  return (
    <section 
      className="min-h-screen flex items-center justify-center border-t"
      style={{ 
        background: 'var(--color-primary-black)',
        borderColor: 'rgba(var(--color-stone-800), 0.3)'
      }}
    >
      <div className="text-center">
        <h2 
          className="text-6xl font-bold mb-4"
          style={{ color: 'var(--color-stone-200)' }}
        >
          CONTACT
        </h2>
        <p 
          className="text-xl"
          style={{ color: 'var(--color-stone-400)' }}
        >
          Let's connect
        </p>
      </div>
    </section>
  );
}