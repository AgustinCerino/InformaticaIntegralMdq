export type ServiceIcon = 'network' | 'shield' | 'monitor' | 'code';

export interface NavItem {
  readonly id: string;
  readonly label: string;
}

export interface Service {
  readonly title: string;
  readonly description: string;
  readonly icon: ServiceIcon;
  readonly items: readonly string[];
}

export interface Certification {
  readonly title: string;
  readonly code: string;
  readonly logo: string;
  readonly width: number;
  readonly height: number;
  readonly summary: string;
  readonly topics: readonly string[];
}

export interface ClientCase {
  readonly name: string;
  readonly category: string;
  readonly work: string;
  readonly image: string;
  readonly width: number;
  readonly height: number;
}

export interface ProcessStep {
  readonly number: string;
  readonly title: string;
  readonly description: string;
}

export const navItems: readonly NavItem[] = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'metodo', label: 'Cómo trabajamos' },
  { id: 'certificaciones', label: 'Certificaciones' },
  { id: 'clientes', label: 'Clientes' },
  { id: 'contacto', label: 'Contacto' },
];

export const services: readonly Service[] = [
  {
    title: 'Administración de redes corporativas',
    description:
      'Diseñamos y mantenemos redes estables, documentadas y preparadas para crecer con tu operación.',
    icon: 'network',
    items: ['VLANs y segmentación', 'Wi-Fi profesional', 'VPN, routing y QoS'],
  },
  {
    title: 'Ciberseguridad',
    description:
      'Reducimos la superficie de ataque con controles concretos y adecuados a la realidad de cada empresa.',
    icon: 'shield',
    items: [
      'Hardening y control de acceso',
      'Firewalls perimetrales',
      'Revisión y respuesta ante incidentes',
    ],
  },
  {
    title: 'Monitoreo y soporte técnico',
    description:
      'Detectamos fallas antes de que escalen y acompañamos la resolución de problemas de hardware y software.',
    icon: 'monitor',
    items: ['Monitoreo con Zabbix', 'Alertas e inventario', 'Soporte remoto y presencial'],
  },
  {
    title: 'Desarrollos a medida',
    description:
      'Creamos herramientas e integraciones que simplifican tareas repetitivas y conectan procesos internos.',
    icon: 'code',
    items: ['Automatizaciones', 'Paneles e integraciones', 'Soluciones adaptadas al negocio'],
  },
];

export const processSteps: readonly ProcessStep[] = [
  {
    number: '01',
    title: 'Relevamiento',
    description:
      'Entendemos el problema, la infraestructura actual y el impacto sobre la operación.',
  },
  {
    number: '02',
    title: 'Plan y presupuesto',
    description: 'Definimos prioridades, alcance, tiempos y costos antes de realizar cambios.',
  },
  {
    number: '03',
    title: 'Implementación',
    description:
      'Ejecutamos por etapas, validamos el resultado y reducimos riesgos durante la transición.',
  },
  {
    number: '04',
    title: 'Documentación y soporte',
    description: 'Entregamos la información técnica necesaria y acordamos los próximos pasos.',
  },
];

export const certifications: readonly Certification[] = [
  {
    title: 'MikroTik Certified Network Associate',
    code: 'MTCNA',
    logo: 'certificaciones/mikrotik-mtcna.svg',
    width: 620,
    height: 320,
    summary: 'Fundamentos sólidos para operar y diseñar redes basadas en MikroTik.',
    topics: [
      'Administración de redes IP',
      'VLANs y segmentación',
      'Routing, NAT y conectividad WAN',
      'Wi-Fi y acceso remoto seguro',
    ],
  },
  {
    title: 'MikroTik Certified Security Engineer',
    code: 'MTCSE',
    logo: 'certificaciones/mikrotik-mtcse.svg',
    width: 620,
    height: 320,
    summary: 'Controles avanzados para proteger redes y administrar tráfico con precisión.',
    topics: [
      'Firewalls avanzados',
      'Políticas y filtrado de tráfico',
      'Seguridad perimetral',
      'Análisis de eventos',
    ],
  },
  {
    title: 'MikroTik Certified Traffic Control Engineer',
    code: 'MTCTCE',
    logo: 'certificaciones/mikrotik-mtctce.svg',
    width: 620,
    height: 320,
    summary:
      'Gestión avanzada del tráfico para priorizar servicios y aprovechar mejor el ancho de banda.',
    topics: [
      'Flujo de paquetes y connection tracking',
      'Firewall, NAT y mangle',
      'QoS, colas simples y queue trees',
      'Priorización, PCQ y control de ancho de banda',
    ],
  },
  {
    title: 'MikroTik Certified IPv6 Engineer',
    code: 'MTCIPv6E',
    logo: 'certificaciones/mikrotik-mtcipv6e.svg',
    width: 620,
    height: 320,
    summary: 'Diseño, implementación y protección de redes IPv6 sobre RouterOS.',
    topics: [
      'Direccionamiento y subnetting IPv6',
      'SLAAC, DHCPv6 y Neighbor Discovery',
      'Routing, firewall e IPsec para IPv6',
      'Dual stack, túneles e interoperabilidad',
    ],
  },
  {
    title: 'Zabbix Certified Professional',
    code: 'ZCP',
    logo: 'certificaciones/zabbix-training-badge_professional-1024x1024.webp',
    width: 1024,
    height: 1024,
    summary: 'Despliegue, seguridad y escalabilidad de plataformas de monitoreo con Zabbix.',
    topics: [
      'Monitoreo distribuido y SNMP',
      'Cifrado entre componentes',
      'Proxies y alta disponibilidad',
      'Recuperación ante fallos',
    ],
  },
];

export const clientCases: readonly ClientCase[] = [
  {
    name: 'Farmacias Riadigos',
    category: 'Salud',
    work: 'Unificación de red entre sucursales, segmentación por áreas y protección de accesos para mejorar la continuidad operativa.',
    image: 'clientes/riadigos.png',
    width: 270,
    height: 186,
  },
  {
    name: 'Farmacias Palkin',
    category: 'Salud',
    work: 'Rediseño de conectividad interna, estabilización de Wi-Fi y soporte en puestos de atención.',
    image: 'clientes/palkin2.jpg',
    width: 200,
    height: 200,
  },
  {
    name: 'Hotel Club del Golf',
    category: 'Hotelería',
    work: 'Optimización de red para recepción y administración, con mejoras de seguridad perimetral y acceso remoto.',
    image: 'clientes/clubdelgolfhotel.jpg',
    width: 225,
    height: 225,
  },
  {
    name: 'Coomarpes',
    category: 'Industria pesquera',
    work: 'Soporte técnico y ordenamiento de infraestructura IT para la operación administrativa y las comunicaciones internas.',
    image: 'clientes/coomarpes.png',
    width: 225,
    height: 225,
  },
];

export const contactServiceOptions = [
  'Diagnóstico general',
  ...services.map((service) => service.title),
  'Otro',
] as const;

export const business = {
  name: 'Informática Integral MDQ',
  email: 'informaticaintegralmdq@gmail.com',
  phones: [
    { display: '+54 9 223 521 6153', href: 'tel:+5492235216153' },
    { display: '+54 9 223 594 6687', href: 'tel:+5492235946687' },
  ],
  hours: 'Lunes a sábado, de 9:00 a 18:00',
  serviceArea: 'Mar del Plata y atención remota',
  whatsapp:
    'https://api.whatsapp.com/send?phone=5492235216153&text=Hola%2C%20vengo%20de%20su%20p%C3%A1gina%20web%20y%20quisiera%20recibir%20asesoramiento%20para%20mi%20empresa.%20%C2%BFPodemos%20conversar%3F',
} as const;
