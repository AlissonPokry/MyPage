/**
 * Competências / Skills data.
 *
 * To add or remove a skill, simply edit this array.
 * No component changes needed — the UI updates automatically.
 *
 * Icons use Devicon CDN for clean, official tech logos.
 */
export interface Skill {
  name: string;
  iconUrl: string;
}

const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';
const LOBEICONS = 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons';

export const SKILLS: Skill[] = [
  { name: 'Typescript', iconUrl: `${DEVICON}/typescript/typescript-original.svg` },
  { name: 'Angular', iconUrl: `${DEVICON}/angular/angular-original.svg` },
  { name: 'Tailwind CSS', iconUrl: `${DEVICON}/tailwindcss/tailwindcss-original.svg` },
  { name: 'C++', iconUrl: `${DEVICON}/cplusplus/cplusplus-original.svg` },
  { name: 'C#', iconUrl: `${DEVICON}/csharp/csharp-original.svg` },
  { name: 'Javascript', iconUrl: `${DEVICON}/javascript/javascript-original.svg` },
  { name: 'Python', iconUrl: `${DEVICON}/python/python-original.svg` },
  { name: 'Antigravity', iconUrl: `${LOBEICONS}/antigravity-color.svg` },
  { name: 'Git', iconUrl: `${DEVICON}/git/git-original.svg` },
  { name: 'AWS', iconUrl: `${LOBEICONS}/aws-color.svg` },
];
