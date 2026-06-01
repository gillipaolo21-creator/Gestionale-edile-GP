'use client';

import type { InputHTMLAttributes } from 'react';
import { useEffect, useMemo, useState } from 'react';

function normalizeLocalizedAmount(value: string, decimals: number): string {
  const compact = value
    .replace(/\s+/g, '')
    .replace(/€/g, '');

  if (!compact) return '';

  let normalized = compact;

  if (normalized.includes(',')) {
    // Italian input style: dots as thousands, comma as decimals.
    normalized = normalized.replace(/\./g, '').replace(',', '.');
  } else {
    const dotCount = (normalized.match(/\./g) ?? []).length;

    if (dotCount > 1) {
      normalized = normalized.replace(/\./g, '');
    } else if (dotCount === 1) {
      const dotIndex = normalized.indexOf('.');
      const decimalLength = normalized.length - dotIndex - 1;
      if (decimalLength === 3) {
        normalized = normalized.replace('.', '');
      }
    }
  }

  normalized = normalized.replace(/[^0-9.-]/g, '');

  if (!normalized || normalized === '-' || normalized === '.') return '';

  const isNegative = normalized.startsWith('-');
  const unsigned = normalized.replace(/-/g, '');
  const [integerRaw, ...decimalParts] = unsigned.split('.');
  const integerPart = integerRaw.length > 0 ? integerRaw : '0';
  const decimalPart = decimalParts.join('').slice(0, Math.max(0, decimals));

  return `${isNegative ? '-' : ''}${integerPart}${decimalPart ? `.${decimalPart}` : ''}`;
}

function formatLocalizedAmount(value: string, decimals: number): string {
  if (!value) return '';

  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed)) return '';

  return parsed.toLocaleString('it-IT', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

type EuroAmountInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> & {
  value: string;
  onValueChange: (nextValue: string) => void;
  decimals?: number;
};

export function EuroAmountInput({
  value,
  onValueChange,
  decimals = 2,
  onFocus,
  onBlur,
  ...rest
}: Readonly<EuroAmountInputProps>) {
  const [isFocused, setIsFocused] = useState(false);
  const [draft, setDraft] = useState('');

  const formattedValue = useMemo(
    () => formatLocalizedAmount(value, decimals),
    [value, decimals],
  );

  useEffect(() => {
    if (!isFocused) {
      setDraft(formattedValue);
    }
  }, [formattedValue, isFocused]);

  return (
    <input
      {...rest}
      type="text"
      inputMode="decimal"
      value={isFocused ? draft : formattedValue}
      onFocus={(event) => {
        setIsFocused(true);
        setDraft(value ? value.replace('.', ',') : '');
        onFocus?.(event);
      }}
      onBlur={(event) => {
        const canonical = normalizeLocalizedAmount(draft, decimals);
        onValueChange(canonical);
        setIsFocused(false);
        setDraft(formatLocalizedAmount(canonical, decimals));
        onBlur?.(event);
      }}
      onChange={(event) => {
        const nextDraft = event.target.value;
        setDraft(nextDraft);
        onValueChange(normalizeLocalizedAmount(nextDraft, decimals));
      }}
    />
  );
}
