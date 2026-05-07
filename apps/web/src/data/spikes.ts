// Spikes: experimental pages that test whether Lemma's grammar can carry a
// new kind of content before it becomes a published module or application.
// Visually distinct from modules / applications on the home page (dashed
// border, spike label) so visitors know what they're looking at.

import type { Locale } from "./glossary";

export interface SpikeMeta {
  id: string;
  href: string;
  title: Record<Locale, string>;
  hook: Record<Locale, string>;
  testing: Record<Locale, string>;
}

export const spikes: SpikeMeta[] = [
  {
    id: "parametric-curves",
    href: "/spike/parametric",
    title: {
      en: 'What is "the same curve"?',
      ko: '"같은 곡선"이란 무엇인가?',
    },
    hook: {
      en: 'Three motions paint the same parabola. The picture is one of three things the word "curve" was secretly carrying.',
      ko: '세 가지 움직임이 같은 포물선을 그린다. "곡선"이라는 한 단어가 몰래 짊어지고 있던 세 가지 중 하나가 그 그림이다.',
    },
    testing: {
      en: "Can Lemma's grammar carry a definitional crisis instead of an external application?",
      ko: "Lemma의 문법이 외부 응용 없이 정의의 위기를 담아낼 수 있는가?",
    },
  },
];
