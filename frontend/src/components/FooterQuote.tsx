import { Star } from 'lucide-react';

const FooterQuote = () => {
  return (
    <div style={{
      backgroundColor: 'var(--primary-light)',
      borderRadius: 'var(--border-radius-lg)',
      padding: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      color: 'var(--primary)',
      fontWeight: '600',
      fontSize: '14px',
      marginTop: '24px'
    }}>
      <Star size={16} />
      <span>Small progress is still progress.</span>
    </div>
  );
};

export default FooterQuote;
