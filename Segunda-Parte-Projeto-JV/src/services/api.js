const NASA_API_KEY = 'DEMO_KEY';
const NASA_APOD_BASE_URL = 'https://api.nasa.gov/planetary/apod';

export const fallbackMissions = [
  {
    id: 'fallback-1',
    title: 'Projeto Kepler-186f',
    description:
      'Missão dedicada à análise de um exoplaneta localizado na zona habitável de sua estrela, com foco em possíveis características atmosféricas compatíveis com estudos astrobiológicos.',
    date: '2026-05-20',
    image:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',
    source: 'Fallback local',
    mediaType: 'image',
  },
  {
    id: 'fallback-2',
    title: 'Europa Clipper Probe',
    description:
      'Exploração científica da lua Europa, de Júpiter, com o objetivo de investigar sua crosta gelada e possíveis oceanos subterrâneos.',
    date: '2024-10-14',
    image:
      'https://images.unsplash.com/photo-1614313913007-2b4ae8ce32d6?auto=format&fit=crop&q=80&w=1200',
    source: 'Fallback local',
    mediaType: 'image',
  },
  {
    id: 'fallback-3',
    title: 'Observatório Lunar Artemis',
    description:
      'Projeto conceitual voltado ao monitoramento astronômico a partir da superfície lunar, com foco em observações de longa duração e baixa interferência atmosférica.',
    date: '2027-01-12',
    image:
      'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=1200',
    source: 'Fallback local',
    mediaType: 'image',
  },
];

function buildApodUrl(count = 10) {
  const params = new URLSearchParams({
    api_key: NASA_API_KEY,
    count: String(count),
  });

  return `${NASA_APOD_BASE_URL}?${params.toString()}`;
}

function normalizeApodItem(item, index) {
  return {
    id: `${item.date || 'nasa'}-${index}`,
    title: item.title || 'Registro astronômico sem título',
    description: item.explanation || 'Descrição indisponível para este registro astronômico.',
    date: item.date || 'Data não informada',
    image: item.url,
    source: item.copyright ? `NASA / ${item.copyright}` : 'NASA APOD',
    mediaType: item.media_type || 'image',
  };
}

export function formatApodData(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .filter((item) => item?.media_type === 'image' && item?.url)
    .map((item, index) => normalizeApodItem(item, index));
}

export async function getSpaceMissions(count = 10) {
  const response = await fetch(buildApodUrl(count));

  if (!response.ok) {
    throw new Error('Não foi possível carregar os dados da API da NASA.');
  }

  const data = await response.json();
  const formattedData = formatApodData(data);

  if (formattedData.length === 0) {
    throw new Error('A API retornou dados sem imagens disponíveis.');
  }

  return formattedData;
}

export async function getSpaceMissionsWithFallback(count = 10) {
  try {
    const missions = await getSpaceMissions(count);

    return {
      missions,
      usingFallback: false,
      error: null,
    };
  } catch (error) {
    return {
      missions: fallbackMissions,
      usingFallback: true,
      error: error.message || 'Erro inesperado ao consultar a API pública.',
    };
  }
}