export function getProvinces(): PROVINCES[] {
  return Object.values(PROVINCES);
}

export function getMunicipalities() {
  return {
    'Pinar del Río': [
      'Sandino',
      'Mantua',
      'Minas de Matahambre',
      'Viñales',
      'La Palma',
      'Los Palacios',
      'Consolación del Sur',
      'Pinar del Río',
      'San Luis',
      'San Juan y Martínez',
      'Guane',
    ],
    Artemisa: [
      'Bahía Honda',
      'Mariel',
      'Guanajay',
      'Caimito',
      'Bauta',
      'San Antonio de los Baños',
      'Güira de Melena',
      'Alquízar',
      'Artemisa',
      'Candelaria',
      'San Cristóbal ',
    ],
    'La Habana': [
      'Playa',
      'Plaza de la Revolución',
      'Centro Habana',
      'La Habana Vieja',
      'Regla',
      'La Habana del Este',
      'Guanabacoa',
      'San Miguel del Padrón',
      'Diez de Octubre',
      'Cerro',
      'Marianao',
      'La Lisa',
      'Boyeros',
      'Arroyo Naranjo',
      'Cotorro',
    ],
    Mayabeque: [
      'Bejucal',
      'San José de las Lajas',
      'Jaruco',
      'Santa Cruz del Norte',
      'Madruga',
      'Nueva Paz',
      'San Nicolás',
      'Güines',
      'Melena del Sur',
      'Batabanó',
      'Quivicán',
    ],
    Matanzas: [
      'Matanzas',
      'Cárdenas',
      'Martí',
      'Colón',
      'Perico',
      'Jovellanos',
      'Pedro Betancourt',
      'Limonar',
      'Unión de Reyes',
      'Ciénaga de Zapata',
      'Jagüey Grande',
      'Calimete',
      'Los Arabos',
    ],
    'Villa Clara': [
      'Corralillo',
      'Quemado de Güines',
      'Sagua la Grande',
      'Encrucijada',
      'Camajuaní',
      'Caibarién',
      'Remedios',
      'Placetas',
      'Santa Clara',
      'Cifuentes',
      'Santo Domingo',
      'Ranchuelo',
      'Manicaragua',
    ],
    Cienfuegos: [
      'Aguada de Pasajeros',
      'Rodas',
      'Palmira',
      'Lajas',
      'Cruces',
      'Cumanayagua',
      'Cienfuegos',
      'Abreus',
    ],
    'Sancti Spíritus': [
      'Yaguajay',
      'Jatibonico',
      'Taguasco',
      'Cabaiguán',
      'Fomento',
      'Trinidad',
      'Sancti Spíritus',
      'La Sierpe',
    ],
    'Ciego de Ávila': [
      'Chambas',
      'Morón',
      'Bolivia',
      'Primero de Enero',
      'Ciro Redondo',
      'Florencia',
      'Majagua',
      'Ciego de Ávila',
      'Venezuela',
      'Baraguá',
    ],
    Camagüey: [
      'Carlos Manuel de Céspedes',
      'Esmeralda',
      'Sierra de Cubitas',
      'Minas',
      'Nuevitas',
      'Guáimaro',
      'Sibanicú',
      'Camagüey',
      'Florida',
      'Vertientes',
      'Jimaguayú',
      'Najasa',
      'Santa Cruz del Sur',
    ],
    'Las Tunas': [
      'Manatí',
      'Puerto Padre',
      'Jesús Menéndez',
      'Majibacoa',
      'Las Tunas',
      'Jobabo',
      'Colombia',
      'Amancio',
    ],
    Holguín: [
      'Gibara',
      'Rafael Freyre',
      'Banes',
      'Antilla',
      'Báguanos',
      'Holguín',
      'Calixto García',
      'Cacocum',
      'Urbano Noris',
      'Cueto',
      'Mayarí',
      'Frank País',
      'Sagua de Tánamo',
      'Moa',
    ],
    Granma: [
      'Río Cauto',
      'Cauto Cristo',
      'Jiguaní',
      'Bayamo',
      'Yara',
      'Manzanillo',
      'Campechuela',
      'Media Luna',
      'Niquero',
      'Pilón',
      'Bartolomé Masó',
      'Buey Arriba',
      'Guisa',
    ],
    'Santiago de Cuba': [
      'Contramaestre',
      'Mella',
      'San Luis',
      'Segundo Frente',
      'Songo - La Maya',
      'Santiago de Cuba',
      'Palma Soriano',
      'Tercer Frente',
      'Guamá',
    ],
    Guantánamo: [
      'El Salvador',
      'Manuel Tames',
      'Yateras',
      'Baracoa',
      'Maisí',
      'Imías',
      'San Antonio del Sur',
      'Caimanera',
      'Guantánamo',
      'Niceto Pérez',
    ],
    'Isla de la Juventud': ['Isla de la Juventud'],
  };
}

export function defaultMunicipality(province: PROVINCES) {
  switch (province) {
    case 'Pinar del Río':
      return 'Pinar del Río';
    case 'Artemisa':
      return 'Artemisa';
    case 'La Habana':
      return 'La Habana Vieja';
    case 'Mayabeque':
      return 'San José de las Lajas';
    case 'Matanzas':
      return 'Matanzas';
    case 'Villa Clara':
      return 'Santa Clara';
    case 'Cienfuegos':
      return 'Cienfuegos';
    case 'Sancti Spíritus':
      return 'Sancti Spíritus';
    case 'Ciego de Ávila':
      return 'Ciego de Ávila';
    case 'Camagüey':
      return 'Camagüey';
    case 'Las Tunas':
      return 'Las Tunas';
    case 'Holguín':
      return 'Holguín';
    case 'Granma':
      return 'Bayamo';
    case 'Santiago de Cuba':
      return 'Santiago de Cuba';
    case 'Guantánamo':
      return 'Guantánamo';
    case 'Isla de la Juventud':
      return 'Isla de la Juventud';
    default:
      return '';
  }
}

export function getMunicipalitiesByProvince(province: PROVINCES) {
  return getMunicipalities()[province];
}
