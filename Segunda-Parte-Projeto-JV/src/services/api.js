const NASA_APOD_URL = 'https://api.nasa.gov/planetary/apod';
const NASA_API_KEY = 'NlSkZm3TB6h3hMJa784BV6uhpzVW7O6e8aLJbtHd';

const DEFAULT_START_DATE = '2024-12-01';
const DEFAULT_END_DATE = '2024-12-08';
const REQUEST_TIMEOUT_MS = 30000;

const fallbackMissions = [
  {
    id: 'fallback-1',
    title: 'Nebulosa de Órion',
    description:
      'Imagem demonstrativa usada quando a API da NASA não responde. A Nebulosa de Órion é uma das regiões de formação estelar mais conhecidas.',
    date: '2026-01-10',
    image: 'https://images-assets.nasa.gov/image/PIA01322/PIA01322~orig.jpg',
    source: 'Dados locais',
    mediaType: 'image',
  },
  {
    id: 'fallback-2',
    title: 'Galáxia de Andrômeda',
    description:
      'Conteúdo local de reserva exibido para manter o aplicativo funcional mesmo quando a API pública atinge limite ou fica indisponível.',
    date: '2026-01-11',
    image: 'https://images-assets.nasa.gov/image/PIA04921/PIA04921~orig.jpg',
    source: 'Dados locais',
    mediaType: 'image',
  },
  {
    id: 'fallback-3',
    title: 'Planeta Marte',
    description:
      'Registro demonstrativo sobre Marte. Este item confirma que a lista continua carregando mesmo quando a API externa apresenta erro.',
    date: '2026-01-12',
    image: 'https://images-assets.nasa.gov/image/PIA04591/PIA04591~orig.jpg',
    source: 'Dados locais',
    mediaType: 'image',
  },
];

function buildApodRangeUrl(startDate = DEFAULT_START_DATE, endDate = DEFAULT_END_DATE) {
  const params = new URLSearchParams({
    api_key: NASA_API_KEY,
    start_date: startDate,
    end_date: endDate,
    thumbs: 'true',
  });

  return `${NASA_APOD_URL}?${params.toString()}`;
}

function getImageFromApodItem(item) {
  if (item?.media_type === 'image' && item?.url) {
    return item.url;
  }

  if (item?.media_type === 'video' && item?.thumbnail_url) {
    return item.thumbnail_url;
  }

  return 'https://images-assets.nasa.gov/image/PIA01322/PIA01322~orig.jpg';
}

function normalizeApodItem(item, index) {
  return {
    id: `${item?.date || 'nasa'}-${index}`,
    title: item?.title || 'Registro astronômico sem título',
    description:
      item?.explanation ||
      'A API retornou este item sem descrição detalhada disponível.',
    date: item?.date || 'Data não informada',
    image: getImageFromApodItem(item),
    source: item?.copyright ? `NASA / ${item.copyright}` : 'NASA APOD',
    mediaType: item?.media_type || 'image',
  };
}

async function fetchWithTimeout(url, timeout = REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    return await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(
        `Tempo limite de ${timeout / 1000}s excedido ao consultar a API da NASA.`
      );
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function getSpaceMissions() {
  const url = buildApodRangeUrl();
  const response = await fetchWithTimeout(url);

  if (!response.ok) {
    let errorMessage = `Erro HTTP ${response.status} ao consultar a API da NASA.`;

    try {
      const errorData = await response.json();

      if (errorData?.msg) {
        errorMessage = errorData.msg;
      }

      if (errorData?.error?.message) {
        errorMessage = errorData.error.message;
      }
    } catch (error) {
      // Mantém a mensagem padrão se a resposta de erro não for JSON.
    }

    throw new Error(errorMessage);
  }

  const data = await response.json();
  const items = Array.isArray(data) ? data : [data];

  const formattedItems = items
    .map(normalizeApodItem)
    .filter((item) => Boolean(item.image));

  if (formattedItems.length === 0) {
    throw new Error('A API da NASA respondeu, mas não retornou itens válidos para exibição.');
  }

  return formattedItems;
}

export async function getSpaceMissionsWithFallback() {
  try {
    const missions = await getSpaceMissions();

    return {
      data: missions,
      fromFallback: false,
      error: '',
    };
  } catch (error) {
    console.warn('Falha ao consultar a API da NASA. Usando dados locais:', error.message);

    return {
      data: fallbackMissions,
      fromFallback: true,
      error: error.message,
    };
  }
}

export { fallbackMissions };
