export type FieldType =
  | 'text'
  | 'textarea'
  | 'longtext'
  | 'number'
  | 'boolean'
  | 'select'
  | 'multiselect'
  | 'tags'
  | 'image'
  | 'gallery'
  | 'url'
  | 'email'
  | 'color'

export interface FieldOption {
  value: string
  label: string
}

export interface FieldDef {
  name: string
  label: string
  type: FieldType
  required?: boolean
  help?: string
  placeholder?: string
  options?: FieldOption[]
  defaultValue?: unknown
  min?: number
  max?: number
  span?: 'full' | 'half'
}

export interface CollectionDef {
  key: string
  collection: string
  label: string
  singular: string
  description: string
  group: 'Content' | 'Creative' | 'Media' | 'Communication' | 'Settings'
  kind: 'list' | 'singleton'
  titleField?: string
  subtitleField?: string
  imageField?: string
  orderable?: boolean
  fields: FieldDef[]
}

const moodScope: FieldOption[] = [
  { value: 'all', label: 'All moods' },
  { value: 'quiet', label: 'Quiet' },
  { value: 'editorial', label: 'Editorial' },
  { value: 'play', label: 'Play' },
]

const moodOptions: FieldOption[] = moodScope.slice(1)

export const collections: CollectionDef[] = [
  {
    key: 'projects',
    collection: 'projects',
    label: 'Projects',
    singular: 'Project',
    description: 'Case studies shown in the work sequence.',
    group: 'Content',
    kind: 'list',
    titleField: 'title',
    subtitleField: 'category',
    imageField: 'coverImage',
    orderable: true,
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'slug', label: 'Slug', type: 'text', required: true, help: 'Lowercase, hyphenated. Used in the URL.' },
      { name: 'shortDescription', label: 'Short description', type: 'textarea', span: 'full' },
      { name: 'description', label: 'Description', type: 'textarea', span: 'full' },
      { name: 'coverImage', label: 'Cover image', type: 'image', span: 'full' },
      { name: 'gallery', label: 'Gallery', type: 'gallery', span: 'full' },
      { name: 'year', label: 'Year', type: 'text', placeholder: '2025' },
      { name: 'category', label: 'Category', type: 'text', placeholder: 'Identity / Web' },
      { name: 'role', label: 'Role', type: 'text' },
      { name: 'client', label: 'Client', type: 'text' },
      { name: 'technologies', label: 'Technologies', type: 'tags' },
      { name: 'services', label: 'Services', type: 'tags' },
      { name: 'githubUrl', label: 'GitHub URL', type: 'url' },
      { name: 'liveUrl', label: 'Live URL', type: 'url' },
      {
        name: 'caseStudy',
        label: 'Case study',
        type: 'longtext',
        span: 'full',
        help: 'Separate paragraphs with a blank line. Lines starting with "## " become chapter headings.',
      },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        defaultValue: 'draft',
        options: [
          { value: 'draft', label: 'Draft' },
          { value: 'published', label: 'Published' },
        ],
      },
      { name: 'featured', label: 'Featured', type: 'boolean', defaultValue: false },
    ],
  },
  {
    key: 'reviews',
    collection: 'reviews',
    label: 'Reviews',
    singular: 'Review',
    description: 'Words from collaborators and clients.',
    group: 'Content',
    kind: 'list',
    titleField: 'name',
    subtitleField: 'company',
    imageField: 'avatar',
    orderable: true,
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'role', label: 'Role', type: 'text' },
      { name: 'company', label: 'Company', type: 'text' },
      { name: 'avatar', label: 'Avatar', type: 'image', span: 'full' },
      { name: 'message', label: 'Quote', type: 'textarea', required: true, span: 'full' },
      { name: 'date', label: 'Date', type: 'text', placeholder: '2026-01-01' },
      { name: 'rating', label: 'Rating', type: 'number', min: 1, max: 5 },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        defaultValue: 'active',
        options: [
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
        ],
      },
      { name: 'featured', label: 'Featured', type: 'boolean', defaultValue: false },
    ],
  },
  {
    key: 'skills',
    collection: 'skills',
    label: 'Skills',
    singular: 'Skill',
    description: 'Design and technology capabilities.',
    group: 'Content',
    kind: 'list',
    titleField: 'name',
    subtitleField: 'category',
    orderable: true,
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      {
        name: 'category',
        label: 'Side',
        type: 'select',
        required: true,
        defaultValue: 'design',
        options: [
          { value: 'design', label: 'Design' },
          { value: 'technology', label: 'Technology' },
        ],
      },
      { name: 'description', label: 'One-line note', type: 'text', span: 'full' },
      { name: 'active', label: 'Active', type: 'boolean', defaultValue: true },
    ],
  },
  {
    key: 'socials',
    collection: 'social_links',
    label: 'Social links',
    singular: 'Social link',
    description: 'Profiles linked in the footer and contact scene.',
    group: 'Content',
    kind: 'list',
    titleField: 'platform',
    subtitleField: 'handle',
    orderable: true,
    fields: [
      { name: 'platform', label: 'Platform', type: 'text', required: true, placeholder: 'Instagram' },
      { name: 'handle', label: 'Handle', type: 'text', placeholder: '@asfakulsiam' },
      { name: 'url', label: 'URL', type: 'url', required: true },
      { name: 'icon', label: 'Icon', type: 'text', placeholder: 'instagram' },
      { name: 'visible', label: 'Visible', type: 'boolean', defaultValue: true },
      { name: 'featured', label: 'Featured', type: 'boolean', defaultValue: false },
    ],
  },
  {
    key: 'memes',
    collection: 'memes',
    label: 'Memes',
    singular: 'Meme',
    description: 'Internet-culture moments woven into the scroll story.',
    group: 'Creative',
    kind: 'list',
    titleField: 'name',
    subtitleField: 'placement',
    imageField: 'image',
    orderable: true,
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Roll Safe' },
      { name: 'image', label: 'Image', type: 'image', required: true, span: 'full' },
      { name: 'altText', label: 'Alt text', type: 'text', required: true, span: 'full' },
      { name: 'caption', label: 'Caption', type: 'textarea', span: 'full' },
      {
        name: 'type',
        label: 'Type',
        type: 'select',
        defaultValue: 'image',
        options: [
          { value: 'image', label: 'Image' },
          { value: 'gif', label: 'GIF' },
        ],
      },
      {
        name: 'placement',
        label: 'Placement',
        type: 'select',
        required: true,
        defaultValue: 'contact',
        options: [
          { value: 'hero', label: 'Hero' },
          { value: 'before-work', label: 'Before work (the pause)' },
          { value: 'between-projects', label: 'Between projects' },
          { value: 'after-work', label: 'After work' },
          { value: 'capabilities', label: 'Capabilities' },
          { value: 'contact', label: 'Contact' },
          { value: 'footer', label: 'Footer' },
        ],
      },
      {
        name: 'trigger',
        label: 'Trigger',
        type: 'select',
        defaultValue: 'section-entry',
        options: [
          { value: 'section-entry', label: 'On section entry' },
          { value: 'scroll-progress', label: 'With scroll progress' },
          { value: 'pinned-pause', label: 'Pinned pause' },
          { value: 'hover', label: 'On hover / tap' },
        ],
      },
      { name: 'mood', label: 'Mood', type: 'select', defaultValue: 'all', options: moodScope },
      {
        name: 'animation',
        label: 'Entrance',
        type: 'select',
        defaultValue: 'rise',
        options: [
          { value: 'fade', label: 'Fade' },
          { value: 'pop', label: 'Pop' },
          { value: 'slide', label: 'Slide' },
          { value: 'rise', label: 'Rise' },
          { value: 'wait', label: 'Wait for it' },
        ],
      },
      { name: 'duration', label: 'Hold length', type: 'number', min: 0.5, max: 4, help: 'Relative length of the pause (0.5 – 4).' },
      { name: 'active', label: 'Active', type: 'boolean', defaultValue: true },
    ],
  },
  {
    key: 'characters',
    collection: 'character_moments',
    label: 'Characters',
    singular: 'Character moment',
    description: 'Bracketed glyph sequences that morph while scrolling.',
    group: 'Creative',
    kind: 'list',
    titleField: 'name',
    subtitleField: 'placement',
    orderable: true,
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, placeholder: 'Curiosity' },
      {
        name: 'frames',
        label: 'Frames',
        type: 'tags',
        required: true,
        span: 'full',
        help: 'Each tag is one frame, played in order. Example: 👀 → 🤔 → 💡 → →',
      },
      {
        name: 'placement',
        label: 'Placement',
        type: 'select',
        required: true,
        defaultValue: 'hero',
        options: [
          { value: 'hero', label: 'Hero' },
          { value: 'statement', label: 'Statement' },
          { value: 'before-work', label: 'Before work' },
          { value: 'capabilities', label: 'Capabilities' },
          { value: 'contact', label: 'Contact' },
        ],
      },
      {
        name: 'trigger',
        label: 'Trigger',
        type: 'select',
        defaultValue: 'scroll-progress',
        options: [
          { value: 'scroll-progress', label: 'Scroll progress' },
          { value: 'section-entry', label: 'Section entry' },
          { value: 'loop', label: 'Loop' },
        ],
      },
      { name: 'mood', label: 'Mood', type: 'select', defaultValue: 'all', options: moodScope },
      { name: 'active', label: 'Active', type: 'boolean', defaultValue: true },
    ],
  },
  {
    key: 'contactMessages',
    collection: 'contact_messages',
    label: 'Contact inbox',
    singular: 'Contact message',
    description: 'Inbound messages submitted through the public contact scene.',
    group: 'Communication',
    kind: 'list',
    titleField: 'name',
    subtitleField: 'email',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'projectType', label: 'Project type', type: 'text' },
      { name: 'message', label: 'Message', type: 'longtext', required: true, span: 'full' },
      { name: 'read', label: 'Read', type: 'boolean', defaultValue: false },
      { name: 'emailStatus', label: 'Email status', type: 'select', options: [
        { value: 'sent', label: 'Sent' },
        { value: 'failed', label: 'Failed' },
        { value: 'skipped', label: 'Skipped' },
      ] },
    ],
  },
  {
    key: 'media',
    collection: 'media_assets',
    label: 'Media library',
    singular: 'Media asset',
    description: 'Uploaded images used by content collections.',
    group: 'Media',
    kind: 'list',
    titleField: 'publicId',
    subtitleField: 'folder',
    imageField: 'url',
    fields: [
      { name: 'publicId', label: 'Public ID', type: 'text', required: true },
      { name: 'url', label: 'URL', type: 'url', required: true },
      { name: 'alt', label: 'Alt text', type: 'text' },
      { name: 'folder', label: 'Folder', type: 'text' },
      { name: 'format', label: 'Format', type: 'text' },
      { name: 'bytes', label: 'Bytes', type: 'number' },
    ],
  },
  {
    key: 'about',
    collection: 'singletons',
    label: 'About & profile',
    singular: 'About',
    description: 'Identity, biography, availability and contact details.',
    group: 'Content',
    kind: 'singleton',
    fields: [
      { name: 'name', label: 'Full name', type: 'text', placeholder: 'ASFAKUL ISLAM SIAM' },
      { name: 'shortName', label: 'Short name', type: 'text', placeholder: 'SIAM' },
      { name: 'headline', label: 'Headline', type: 'textarea', span: 'full' },
      { name: 'biography', label: 'Biography', type: 'longtext', span: 'full' },
      { name: 'profileImage', label: 'Portrait', type: 'image', span: 'full' },
      { name: 'gallery', label: 'Gallery', type: 'gallery', span: 'full' },
      { name: 'location', label: 'Location', type: 'text', placeholder: 'Dhaka, Bangladesh' },
      { name: 'timezone', label: 'Timezone', type: 'text', placeholder: 'Asia/Dhaka', help: 'IANA timezone for the live clock.' },
      { name: 'availability', label: 'Availability note', type: 'text', placeholder: 'Booking Q3' },
      { name: 'availableForWork', label: 'Available for work', type: 'boolean', defaultValue: true },
      { name: 'email', label: 'Public email', type: 'email' },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'disciplines', label: 'Disciplines', type: 'tags', span: 'full', help: 'Digital Design, Creative Development, Interaction…' },
    ],
  },
  {
    key: 'settings',
    collection: 'singletons',
    label: 'Site & SEO',
    singular: 'Settings',
    description: 'Metadata, sharing and email routing.',
    group: 'Settings',
    kind: 'singleton',
    fields: [
      { name: 'siteTitle', label: 'Site name', type: 'text' },
      { name: 'authorNames', label: 'Author name(s)', type: 'tags', span: 'full' },
      { name: 'aboutInfo', label: 'About info', type: 'longtext', span: 'full' },
      { name: 'contactLocation', label: 'Contact location', type: 'text' },
      { name: 'siteDescription', label: 'Site description', type: 'textarea', span: 'full' },
      { name: 'siteUrl', label: 'Canonical URL', type: 'url', placeholder: 'https://asfakulsiam.com' },
      { name: 'ogImage', label: 'Share image', type: 'image', span: 'full' },
      { name: 'keywords', label: 'Keywords', type: 'tags', span: 'full' },
      { name: 'twitterHandle', label: 'X / Twitter handle', type: 'text' },
      { name: 'contactRecipient', label: 'Contact recipient email', type: 'email', help: 'Where contact form submissions are delivered.' },
      { name: 'contactFromName', label: 'Email sender name', type: 'text' },
      { name: 'footerNote', label: 'Footer content', type: 'text', span: 'full' },
      { name: 'resumeUrl', label: 'Resume URL', type: 'url' },
      { name: 'resumeLabel', label: 'Resume label', type: 'text', placeholder: 'Download résumé' },
      { name: 'resumeUpdatedAt', label: 'Resume updated', type: 'text', placeholder: 'September 2026' },
      { name: 'availabilityLabel', label: 'Availability', type: 'text', placeholder: 'Available for Q4 2026' },
      { name: 'availabilityStatus', label: 'Availability status', type: 'select', defaultValue: 'available', options: [
        { value: 'available', label: 'Available' },
        { value: 'booked', label: 'Booked' },
        { value: 'open-to-enquiries', label: 'Open to enquiries' },
      ] },
      { name: 'location', label: 'Location', type: 'text', placeholder: 'Dhaka, Bangladesh' },
      { name: 'githubUrl', label: 'GitHub URL', type: 'url' },
      { name: 'linkedinUrl', label: 'LinkedIn URL', type: 'url' },
      { name: 'legalText', label: 'Legal text', type: 'longtext', span: 'full' },
      { name: 'privacyText', label: 'Privacy text', type: 'longtext', span: 'full' },
    ],
  },
  {
    key: 'now',
    collection: 'singletons',
    label: 'What I’m doing now',
    singular: 'Now status',
    description: 'The current focus shown on the public site.',
    group: 'Content',
    kind: 'singleton',
    fields: [
      { name: 'updatedAt', label: 'Updated', type: 'text', required: true, placeholder: 'September 2026' },
      { name: 'title', label: 'Title', type: 'text', required: true, span: 'full' },
      { name: 'body', label: 'Body', type: 'longtext', required: true, span: 'full' },
      { name: 'location', label: 'Location', type: 'text', placeholder: 'Based in Dhaka, Bangladesh' },
      { name: 'focus', label: 'Focus areas', type: 'tags', span: 'full' },
    ],
  },
  {
    key: 'moods',
    collection: 'singletons',
    label: 'Moods',
    singular: 'Mood settings',
    description: 'Art-direction defaults. The engine itself lives in code.',
    group: 'Creative',
    kind: 'singleton',
    fields: [
      { name: 'defaultMood', label: 'Default mood', type: 'select', defaultValue: 'editorial', options: moodOptions },
      {
        name: 'enabledMoods',
        label: 'Enabled moods',
        type: 'multiselect',
        defaultValue: ['quiet', 'editorial', 'play'],
        options: moodOptions,
      },
      { name: 'quietAccent', label: 'Quiet accent', type: 'color' },
      { name: 'editorialAccent', label: 'Editorial accent', type: 'color' },
      { name: 'playAccent', label: 'Play accent', type: 'color' },
    ],
  },
]

export function getCollectionDef(key: string) {
  return collections.find((c) => c.key === key)
}
