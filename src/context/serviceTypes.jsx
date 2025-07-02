// import snowflakedark from '../assets/icons/snowflake-dark.png';
import snowflakelight from '../assets/icons/snowflake-light.png';
import sunny from '../assets/icons/sunny.png';
// import wrenchgearlight from '../assets/icons/wrench-gear-light.png';
import wrenchgeardark from '../assets/icons/wrench-gear.png';

const serviceTypes = [
  {
    id: 1,
    title: 'Pool Opening',
    icon: sunny,
    desc: 'Get your pool ready for summer with our comprehensive pool opening service, ensuring a clean and safe start to your swimming season.',
    features: [
      'Remove winter cover',
      'Start up pump and filter',
      'Test and balance water chemistry',
      'Brush pool walls and floor',
      'Initial vacuuming and skimming',
    ],
  },
  {
    id: 2,
    title: 'Pool Closing',
    icon: snowflakelight,
    desc: 'Protect your pool during the off-season with our professional closing service, preparing it for winter and preventing costly damage.',
    features: [
      'Drain water to winterizing level',
      'Blow out and plug lines',
      'Remove and store accessories',
      'Apply winterizing chemicals',
      'Install winter cover',
    ],
  },
  {
    id: 3,
    title: 'Pool Services',
    icon: wrenchgeardark, 
    desc: 'Maintain pristine water quality and optimal equipment performance with our regular pool servicing, tailored to your needs.',
    features: [
      'Full-service weekly/bi-weekly cleaning',
      'Water testing and chemical balancing',
      'Equipment inspection and maintenance',
      'Skimming and vacuuming',
      'Filter cleaning and backwashing',
    ],
  },
];

export { serviceTypes };