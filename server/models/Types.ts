export type UserData =
  | {
      type: 'client';
      id: string;
    }
  | {
      type: 'agent';
      avatar: string;
      firstname: string;
      lastname: string;
      phone: string;
      bio: string;
      id: string;
    };

export type Address = {
  province: PROVINCES;
  municipality: string;
};

export type Features = {
  bed: number;
  bath: number;
  garage: boolean;
  garden: boolean;
  pool: boolean;
  furnished: boolean;
};

export type Property = {
  address: Address;
  features: Features;
};

export type SaleDetails = {
  amount: number;
  currency: 'USD' | 'CUP';
};

export type RentDetails = {
  tax: number;
  currency: 'USD' | 'CUP';
  frequency: 'daily' | 'monthly';
};

export type ExchangeDetails = {
  needs: number;
  offers: number;
};

export type Details = SaleDetails | RentDetails | ExchangeDetails;

export type Author = {
  authorId: string;
  agent?: {
    firstname: string;
    lastname: string;
    avatar: string;
    email: string;
  };
};

export type Contact = {
  whatsapp: boolean;
  phone: string;
};

export type PostData =
  | {
      type: 'sale';
      id: string;
      details: SaleDetails;
      description: string;
      contact: Contact;
      images: string[];
      author: Author;
      properties: Property[];
    }
  | {
      type: 'rent';
      id: string;
      details: RentDetails;
      description: string;
      contact: Contact;
      images: string[];
      author: Author;
      properties: Property[];
    }
  | {
      type: 'exchange';
      id: string;
      details: ExchangeDetails;
      description: string;
      contact: Contact;
      images: string[];
      author: Author;
      properties: Property[];
    };

export enum PROVINCES {
  'Pinar del Río' = 'Pinar del Río',
  'Artemisa' = 'Artemisa',
  'La Habana' = 'La Habana',
  'Mayabeque' = 'Mayabeque',
  'Matanzas' = 'Matanzas',
  'Villa Clara' = 'Villa Clara',
  'Cienfuegos' = 'Cienfuegos',
  'Sancti Spíritus' = 'Sancti Spíritus',
  'Ciego de Ávila' = 'Ciego de Ávila',
  'Camagüey' = 'Camagüey',
  'Las Tunas' = 'Las Tunas',
  'Holguín' = 'Holguín',
  'Granma' = 'Granma',
  'Santiago de Cuba' = 'Santiago de Cuba',
  'Guantánamo' = 'Guantánamo',
  'Isla de la Juventud' = 'Isla de la Juventud',
}

export enum COUNTRYCODES {
  'cu' = 'cu',
  'us' = 'us',
  'es' = 'es',
  'mx' = 'mx',
  'it' = 'it',
  'ad' = 'ad',
  'ae' = 'ae',
  'af' = 'af',
  'ag' = 'ag',
  'ai' = 'ai',
  'al' = 'al',
  'am' = 'am',
  'ao' = 'ao',
  'ar' = 'ar',
  'as' = 'as',
  'at' = 'at',
  'au' = 'au',
  'aw' = 'aw',
  'ax' = 'ax',
  'az' = 'az',
  'ba' = 'ba',
  'bb' = 'bb',
  'bd' = 'bd',
  'be' = 'be',
  'bf' = 'bf',
  'bg' = 'bg',
  'bh' = 'bh',
  'bi' = 'bi',
  'bj' = 'bj',
  'bl' = 'bl',
  'bm' = 'bm',
  'bn' = 'bn',
  'bo' = 'bo',
  'bq' = 'bq',
  'br' = 'br',
  'bs' = 'bs',
  'bt' = 'bt',
  'bw' = 'bw',
  'by' = 'by',
  'bz' = 'bz',
  'ca' = 'ca',
  'cc' = 'cc',
  'cd' = 'cd',
  'cf' = 'cf',
  'cg' = 'cg',
  'ch' = 'ch',
  'ci' = 'ci',
  'ck' = 'ck',
  'cl' = 'cl',
  'cm' = 'cm',
  'cn' = 'cn',
  'co' = 'co',
  'cr' = 'cr',
  'cv' = 'cv',
  'cw' = 'cw',
  'cx' = 'cx',
  'cy' = 'cy',
  'cz' = 'cz',
  'de' = 'de',
  'dj' = 'dj',
  'dk' = 'dk',
  'dm' = 'dm',
  'do' = 'do',
  'dz' = 'dz',
  'ec' = 'ec',
  'ee' = 'ee',
  'eg' = 'eg',
  'eh' = 'eh',
  'er' = 'er',
  'et' = 'et',
  'fi' = 'fi',
  'fj' = 'fj',
  'fk' = 'fk',
  'fm' = 'fm',
  'fo' = 'fo',
  'fr' = 'fr',
  'ga' = 'ga',
  'gb' = 'gb',
  'gd' = 'gd',
  'ge' = 'ge',
  'gf' = 'gf',
  'gg' = 'gg',
  'gh' = 'gh',
  'gi' = 'gi',
  'gl' = 'gl',
  'gm' = 'gm',
  'gn' = 'gn',
  'gp' = 'gp',
  'gq' = 'gq',
  'gr' = 'gr',
  'gt' = 'gt',
  'gu' = 'gu',
  'gw' = 'gw',
  'gy' = 'gy',
  'hk' = 'hk',
  'hn' = 'hn',
  'hr' = 'hr',
  'ht' = 'ht',
  'hu' = 'hu',
  'id' = 'id',
  'ie' = 'ie',
  'il' = 'il',
  'im' = 'im',
  'in' = 'in',
  'io' = 'io',
  'iq' = 'iq',
  'ir' = 'ir',
  'is' = 'is',
  'je' = 'je',
  'jm' = 'jm',
  'jo' = 'jo',
  'jp' = 'jp',
  'ke' = 'ke',
  'kg' = 'kg',
  'kh' = 'kh',
  'ki' = 'ki',
  'km' = 'km',
  'kn' = 'kn',
  'kp' = 'kp',
  'kr' = 'kr',
  'kw' = 'kw',
  'ky' = 'ky',
  'kz' = 'kz',
  'la' = 'la',
  'lb' = 'lb',
  'lc' = 'lc',
  'li' = 'li',
  'lk' = 'lk',
  'lr' = 'lr',
  'ls' = 'ls',
  'lt' = 'lt',
  'lu' = 'lu',
  'lv' = 'lv',
  'ly' = 'ly',
  'ma' = 'ma',
  'mc' = 'mc',
  'md' = 'md',
  'me' = 'me',
  'mf' = 'mf',
  'mg' = 'mg',
  'mh' = 'mh',
  'mk' = 'mk',
  'ml' = 'ml',
  'mm' = 'mm',
  'mn' = 'mn',
  'mo' = 'mo',
  'mp' = 'mp',
  'mq' = 'mq',
  'mr' = 'mr',
  'ms' = 'ms',
  'mt' = 'mt',
  'mu' = 'mu',
  'mv' = 'mv',
  'mw' = 'mw',
  'my' = 'my',
  'mz' = 'mz',
  'na' = 'na',
  'nc' = 'nc',
  'ne' = 'ne',
  'nf' = 'nf',
  'ng' = 'ng',
  'ni' = 'ni',
  'nl' = 'nl',
  'no' = 'no',
  'np' = 'np',
  'nr' = 'nr',
  'nu' = 'nu',
  'nz' = 'nz',
  'om' = 'om',
  'pa' = 'pa',
  'pe' = 'pe',
  'pf' = 'pf',
  'pg' = 'pg',
  'ph' = 'ph',
  'pk' = 'pk',
  'pl' = 'pl',
  'pm' = 'pm',
  'pr' = 'pr',
  'ps' = 'ps',
  'pt' = 'pt',
  'pw' = 'pw',
  'py' = 'py',
  'qa' = 'qa',
  're' = 're',
  'ro' = 'ro',
  'rs' = 'rs',
  'ru' = 'ru',
  'rw' = 'rw',
  'sa' = 'sa',
  'sb' = 'sb',
  'sc' = 'sc',
  'sd' = 'sd',
  'se' = 'se',
  'sg' = 'sg',
  'sh' = 'sh',
  'si' = 'si',
  'sj' = 'sj',
  'sk' = 'sk',
  'sl' = 'sl',
  'sm' = 'sm',
  'sn' = 'sn',
  'so' = 'so',
  'sr' = 'sr',
  'ss' = 'ss',
  'st' = 'st',
  'sv' = 'sv',
  'sx' = 'sx',
  'sy' = 'sy',
  'sz' = 'sz',
  'tc' = 'tc',
  'td' = 'td',
  'tg' = 'tg',
  'th' = 'th',
  'tj' = 'tj',
  'tk' = 'tk',
  'tl' = 'tl',
  'tm' = 'tm',
  'tn' = 'tn',
  'to' = 'to',
  'tr' = 'tr',
  'tt' = 'tt',
  'tv' = 'tv',
  'tw' = 'tw',
  'tz' = 'tz',
  'ua' = 'ua',
  'ug' = 'ug',
  'uy' = 'uy',
  'uz' = 'uz',
  'va' = 'va',
  'vc' = 'vc',
  've' = 've',
  'vg' = 'vg',
  'vi' = 'vi',
  'vn' = 'vn',
  'vu' = 'vu',
  'wf' = 'wf',
  'ws' = 'ws',
  'xk' = 'xk',
  'ye' = 'ye',
  'yt' = 'yt',
  'za' = 'za',
  'zm' = 'zm',
  'zw' = 'zw',
}
