export type ProductMenu = {
  name?: string
  url?: string
  iconUrl?: string
  target?: string
  menus?: ProductMenu[]
}

export type ProductNavCategory = {
  name?: string
  menus?: ProductMenu[]
}

export type TopNavResponse = {
  icon?: string
  favicon?: string
  tabName?: string
}

export type SetTopNavRequest = {
  icon?: string
  favicon?: string
  tabName?: string
}

export type GProductLicense = {
  id?: string
  name?: string
  module?: string
  level?: string
  status?: string
  expiredAt?: string
}

export type GProductLicenseInfo = {
  id?: string
  name?: string
  module?: string
  licenseKey?: string
  licenseLevel?: string
  physicalUsedCpu?: string
  physicalMaxCpu?: string
  virtualUsedCpu?: string
  virtualMaxCpu?: string
  expiredAt?: string
  usedNode?: string
  maxNode?: string
}

export type GetGProductLicensesOverQuotaResponse = {
  expireSoonLicenses?: GProductLicense[]
  expiredLicenses?: GProductLicense[]
}

export type GProduct = {
  id?: string
  title?: string
  url?: string
  uiAssetsUrl?: string
  needImportLicense?: boolean
  needUpdateExpiredLicense?: boolean
}
