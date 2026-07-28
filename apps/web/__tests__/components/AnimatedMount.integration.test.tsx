import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AnimatedMount } from '@/components/ui/AnimatedMount';

/**
 * Tests d'intégration pour AnimatedMount.
 * Vérifie le rendu dans le DOM avec différentes configurations.
 */

const originalMatchMedia = window.matchMedia;
afterEach(() => {
  window.matchMedia = originalMatchMedia;
});

function mockMatchMedia(prefersReduced: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: prefersReduced,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
}

describe('AnimatedMount — intégration', () => {
  it('render avec le variant fade', () => {
    mockMatchMedia(false);
    render(<AnimatedMount animation="fade"><p>Fade test</p></AnimatedMount>);
    expect(screen.getByText('Fade test')).toBeDefined();
  });

  it('render avec le variant zoom-in et classes modales', () => {
    mockMatchMedia(false);
    render(<AnimatedMount animation="zoom-in" className="glass-card rounded-3xl w-full max-w-lg overflow-hidden"><p>Zoom test</p></AnimatedMount>);
    expect(screen.getByText('Zoom test')).toBeDefined();
  });

  it('forwarde onClick et déclenche le handler', () => {
    mockMatchMedia(false);
    let clicked = false;
    const { container } = render(
      <AnimatedMount animation="fade" onClick={() => { clicked = true; }}>
        <p>Click test</p>
      </AnimatedMount>
    );
    expect(screen.getByText('Click test')).toBeDefined();
    // Simulation du clic sur le wrapper AnimatedMount
    container.firstElementChild?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(clicked).toBe(true);
  });

  it('render avec slide-up et durationMs', () => {
    mockMatchMedia(false);
    const { container } = render(
      <AnimatedMount animation="slide-up" durationMs={500}>
        <p>Slide up test</p>
      </AnimatedMount>
    );
    expect(screen.getByText('Slide up test')).toBeDefined();
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.animationDuration).toBe('500ms');
  });

  it('maintient les classes CSS', () => {
    mockMatchMedia(false);
    const { container } = render(
      <AnimatedMount animation="fade" className="flex justify-between">
        <p>Layout classes</p>
      </AnimatedMount>
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain('flex');
    expect(el.className).toContain('justify-between');
  });

  it('a les optimisations GPU dans le style inline', () => {
    mockMatchMedia(false);
    const { container } = render(
      <AnimatedMount animation="fade"><p>GPU test</p></AnimatedMount>
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.willChange).toBe('transform, opacity');
    expect(el.style.backfaceVisibility).toBe('hidden');
  });

  it('gère reduced motion sans wrapper', () => {
    mockMatchMedia(true);
    const { container } = render(
      <AnimatedMount animation="slide-up"><p>Reduced</p></AnimatedMount>
    );
    expect(container.firstElementChild?.tagName.toLowerCase()).toBe('p');
  });
});
