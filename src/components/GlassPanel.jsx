import clsx from '../utils/clsx';

// Reusable liquid-glass surface. `tone` selects light-on-dark vs dark-on-light.
export default function GlassPanel({ as: Tag = 'div', tone = 'light', className = '', children, ...rest }) {
  return (
    <Tag
      className={clsx(
        'relative overflow-hidden rounded-2xl',
        tone === 'light' ? 'glass' : 'glass-dark',
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
