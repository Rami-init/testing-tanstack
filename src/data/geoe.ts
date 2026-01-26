import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
// import { promises as fs } from 'fs'
// import { dirname, join } from 'path'
// import { fileURLToPath } from 'url'
import { projectsData } from './productsData'

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = dirname(__filename)
// const PRODUCTS_JSON_PATH = join(__dirname, 'products.json')

export const fetchProducts = createServerFn({
  method: 'GET',
}).handler(() => {
  // Try to read from cached JSON file first
  //   try {
  //     const cached = await fs.readFile(PRODUCTS_JSON_PATH, 'utf-8')
  //     const products = JSON.parse(cached)
  //     console.log('Loaded products from cached JSON file')
  //     return products
  //   } catch {
  //     // File doesn't exist, fetch from API
  //   }

  //   const apiKey = process.env.SERPAPI_KEY
  //   if (!apiKey) {
  //     throw new Error('Missing SERPAPI_KEY env var')
  //   }

  //   const allResults: any[] = []
  //   const maxPages = 5 // Fetch up to 5 pages to get enough products

  //   for (let page = 1; page <= maxPages; page++) {
  //     const url = new URL('https://serpapi.com/search.json')
  //     url.searchParams.set('engine', 'ebay')
  //     url.searchParams.set('_nkw', 'iphone')
  //     url.searchParams.set('_sop', '10')
  //     url.searchParams.set('LH_ItemCondition', '1000') // Brand New condition filter
  //     url.searchParams.set('_udlo', '400') // Minimum price $400
  //     url.searchParams.set('_pgn', String(page)) // Page number
  //     url.searchParams.set('api_key', apiKey)

  //     const response = await fetch(url.toString())
  //     if (!response.ok) {
  //       throw new Error(`SerpApi request failed: ${response.status}`)
  //     }

  //     const json = await response.json()
  //     const results = json?.organic_results ?? []
  //     console.log(`Page ${page}: ${results.length} results`)

  //     if (results.length === 0) break

  //     allResults.push(...results)

  //     // Stop if we have enough
  //     if (allResults.length >= 60) break
  //   }

  //   console.log('Total fetched results:', allResults.length)

  //   // Filter: iPhones only (title contains iphone), limit to 60 products
  //   const filtered = allResults
  //     .filter((product: any) => {
  //       const title = (product.title ?? '').toLowerCase()
  //       return title.includes('iphone')
  //     })
  //     .slice(0, 60)

  //   console.log('Filtered results:', filtered.length)

  //   // Save results to JSON file
  //   await fs.writeFile(
  //     PRODUCTS_JSON_PATH,
  //     JSON.stringify(filtered, null, 2),
  //     'utf-8',
  //   )
  //   console.log('Saved products to JSON file:', PRODUCTS_JSON_PATH)

  return projectsData
})
export const productQueryKeys = {
  all: () => ['products'],
  getProducts: () => [...productQueryKeys.all()],
}
export const fetchProductsQueryOPtions = queryOptions({
  queryKey: productQueryKeys.all(),
  queryFn: fetchProducts,
})
