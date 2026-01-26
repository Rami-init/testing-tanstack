import { promises as fs } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServerFn } from '@tanstack/react-start'
import { queryOptions } from '@tanstack/react-query'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PRODUCTS_JSON_PATH = join(__dirname, 'products.json')

export const fetchProducts = createServerFn({
  method: 'GET',
}).handler(async () => {
  // Try to read from cached JSON file first
  try {
    const cached = await fs.readFile(PRODUCTS_JSON_PATH, 'utf-8')
    const products = JSON.parse(cached)
    console.log('Loaded products from cached JSON file')
    return products
  } catch {
    // File doesn't exist, fetch from API
  }

  const apiKey = process.env.SERPAPI_KEY
  if (!apiKey) {
    throw new Error('Missing SERPAPI_KEY env var')
  }

  const allResults: Array<any> = []
  const maxPages = 20 // Fetch up to 20 pages to get enough products

  for (let page = 1; page <= maxPages; page++) {
    const url = new URL('https://serpapi.com/search.json')
    url.searchParams.set('engine', 'amazon')
    url.searchParams.set('amazon_domain', 'amazon.com')
    url.searchParams.set('k', 'iphone new')
    url.searchParams.set('p_n_condition-type', '2224371011') // New condition
    url.searchParams.set('p_36', '40000-') // Price: $400+ (in cents)
    url.searchParams.set('page', String(page)) // Page number
    url.searchParams.set('api_key', apiKey)

    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new Error(`SerpApi request failed: ${response.status}`)
    }

    const json = await response.json()
    const results = json?.organic_results ?? []
    console.log(`Page ${page}: ${results.length} results`)

    if (results.length === 0) break

    allResults.push(...results)

    // Stop if we have enough
    if (allResults.length >= 150) break
  }

  console.log('Total fetched results:', allResults.length)

  // Filter: iPhones only, Brand New, price > $400, limit to 150 products
  const filtered = allResults
    .filter((product: any) => {
      const title = (product.title ?? '').toLowerCase()
      const isIphone = title.includes('iphone')

      // Extract price from Amazon format
      const priceStr =
        product.price?.raw ?? product.price?.extracted ?? product.price ?? ''
      const priceMatch = priceStr.toString().replace(/[^0-9.]/g, '')
      const price = parseFloat(priceMatch) || 0

      return isIphone && price > 400
    })
    .slice(0, 150)

  console.log('Filtered results:', filtered.length)

  // Save results to JSON file
  await fs.writeFile(
    PRODUCTS_JSON_PATH,
    JSON.stringify(filtered, null, 2),
    'utf-8',
  )
  console.log('Saved products to JSON file:', PRODUCTS_JSON_PATH)

  return filtered
})
export const productQueryKeys = {
  all: () => ['products'],
  getProducts: () => [...productQueryKeys.all()],
}
export const fetchProductsQueryOPtions = queryOptions({
  queryKey: productQueryKeys.all(),
  queryFn: fetchProducts,
})
