export interface DocPage {
  source: string;
  slug: string;
  title: string;
  description: string;
  section: 'Start here' | 'Build & configure' | 'Reference';
  order: number;
}

export const docs: DocPage[] = [
  {
    source: 'index.md',
    slug: '',
    title: 'GATAS overview',
    description: 'Meet the GATAS multi-protocol conspicuity device for General Aviation.',
    section: 'Start here',
    order: 1,
  },
  {
    source: 'gatas-Pulse.md',
    slug: 'pulse-builder-guide',
    title: 'Pulse builder’s guide',
    description: 'Parts, printing, assembly and wiring instructions for GATAS Pulse.',
    section: 'Start here',
    order: 2,
  },
  {
    source: 'Firmware-Install.md',
    slug: 'firmware-install',
    title: 'Install firmware',
    description: 'Flash GATAS firmware onto a Raspberry Pi Pico for the first time.',
    section: 'Start here',
    order: 3,
  },
  {
    source: 'First-Time-Setup.md',
    slug: 'first-time-setup',
    title: 'First-time setup',
    description: 'Configure Wi-Fi, EFB connectivity, mobile routers and groundstation mode.',
    section: 'Build & configure',
    order: 4,
  },
  {
    source: 'Update-Firmware.md',
    slug: 'update-firmware',
    title: 'Update firmware',
    description: 'Put GATAS into boot mode and install a current firmware release.',
    section: 'Build & configure',
    order: 5,
  },
  {
    source: 'gatas-Connect.md',
    slug: 'gatas-connect',
    title: 'GATAS Connect',
    description: 'Add internet-sourced ADS-B and MLAT traffic to your GATAS device.',
    section: 'Build & configure',
    order: 6,
  },
  {
    source: 'All modules explained.md',
    slug: 'modules',
    title: 'All modules',
    description: 'Understand every GATAS service, configuration option and dependency.',
    section: 'Reference',
    order: 7,
  },
  {
    source: 'FAQ.md',
    slug: 'faq',
    title: 'Frequently asked questions',
    description: 'Answers about Wi-Fi, GPS, LED patterns, DDB and EFB connectivity.',
    section: 'Reference',
    order: 8,
  },
  {
    source: 'For-Developers.md',
    slug: 'developers',
    title: 'For developers',
    description: 'Build, debug and modify the GATAS firmware and development environment.',
    section: 'Reference',
    order: 9,
  },
  {
    source: 'License.md',
    slug: 'license',
    title: 'License',
    description: 'Review the software license that applies to the GATAS project.',
    section: 'Reference',
    order: 10,
  },
];

export const sections = ['Start here', 'Build & configure', 'Reference'] as const;

export const baseUrl = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;
export const hrefFor = (slug: string) => `${baseUrl}${slug ? `${slug}/` : ''}`;
