import type { RouteLocationNormalized, Router, RouteRecordNormalized } from 'vue-router'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { isUrl } from '@/utils/is'
import { cloneDeep, omit } from 'lodash-es'

const modules = import.meta.glob('../views/**/*.{vue,tsx}')
/**
 * 注册一个异步组件
 * @param componentPath 例:/bpm/oa/leave/detail
 */
export const registerComponent = (componentPath: string) => {
  for (const item in modules) {
    if (item.includes(componentPath)) {
      // 使用异步组件的方式来动态加载组件
      // @ts-ignore
      return defineAsyncComponent(modules[item])
    }
  }
}
/* Layout */
export const Layout = () => import('@/layout/Layout.vue')

export const getParentLayout = () => {
  return () =>
    new Promise((resolve) => {
      resolve({
        name: 'ParentLayout'
      })
    })
}

// 按照路由中meta下的rank等级升序来排序路由
export const ascending = (arr: any[]) => {
  arr.forEach((v) => {
    if (v?.meta?.rank === null) v.meta.rank = undefined
    if (v?.meta?.rank === 0) {
      if (v.name !== 'home' && v.path !== '/') {
        console.warn('rank only the home page can be 0')
      }
    }
  })
  return arr.sort((a: { meta: { rank: number } }, b: { meta: { rank: number } }) => {
    return a?.meta?.rank - b?.meta?.rank
  })
}

export const getRawRoute = (route: RouteLocationNormalized): RouteLocationNormalized => {
  if (!route) return route
  const { matched, ...opt } = route
  return {
    ...opt,
    matched: (matched
      ? matched.map((item) => ({
          meta: item.meta,
          name: item.name,
          path: item.path
        }))
      : undefined) as RouteRecordNormalized[]
  }
}

// 后端控制路由生成
export const generateRoute = (routes: AppCustomRouteRecordRaw[]): AppRouteRecordRaw[] => {
  const res: AppRouteRecordRaw[] = []
  const modulesRoutesKeys = Object.keys(modules)

  const nameCountMap = new Map()// ✅ 添加名称去重映射

  for (const route of routes) {
    const meta = {
      title: route.name,
      icon: route.icon,
      hidden: !route.visible,
      noCache: !route.keepAlive,
      alwaysShow:
        route.children &&
        route.children.length === 1 &&
        (route.alwaysShow !== undefined ? route.alwaysShow : true)
    }
    // 生成基础名称
    let baseName = route.componentName && route.componentName.length > 0
      ? route.componentName
      : toCamelCase(route.path, true)

    // ✅ 方案2：根据模块添加前缀
    if (route.component?.includes('bpm/')) {
      baseName = `Bpm${baseName}`
    } else if (route.component?.includes('mall/')) {
      baseName = `Mall${baseName}`
    } else if (route.component?.includes('iot/')) {
      baseName = `Iot${baseName}`
    } else if (route.component?.includes('crm/')) {
      baseName = `Crm${baseName}`
    } else if (route.component?.includes('system/')) {
      baseName = `System${baseName}`
    } else if (route.component?.includes('infra/')) {
      baseName = `Infra${baseName}`
    }
    // ✅ 处理重复名称
    const count = nameCountMap.get(baseName) || 0
    if (count > 0) {
      console.warn(`⚠️ 发现重复路由名称: ${baseName}，自动重命名`)
      baseName = `${baseName}${count}`
    }
    nameCountMap.set(baseName, count + 1)

    // 路由地址转首字母大写驼峰，作为路由名称，适配keepAlive
    let data: AppRouteRecordRaw = {
      path: route.path,
      name:baseName, // 使用处理后的名称
      redirect: route.redirect,
      meta: meta
    }
    // ✅ 检查生成的名称
    console.log(`🔍 生成路由: path=${route.path}, name=${data.name}`)
    //处理顶级非目录路由
    if (!route.children && route.parentId == 0 && route.component) {
      data.component = Layout
      data.meta = {}
      data.name = baseName + 'Parent' // ✅ 使用处理后的 baseName 而不是重新生成
      data.redirect = ''
      meta.alwaysShow = true
      const childrenData: AppRouteRecordRaw = {
        path: '',
        name: baseName,// ✅ 使用处理后的 baseName
        redirect: route.redirect,
        meta: meta
      }
      const index = route?.component
        ? modulesRoutesKeys.findIndex((ev) => ev.includes(route.component))
        : modulesRoutesKeys.findIndex((ev) => ev.includes(route.path))
      childrenData.component = modules[modulesRoutesKeys[index]]
      data.children = [childrenData]
    } else {
      // 目录
      if (route.children) {
        data.component = Layout
        data.redirect = getRedirect(route.path, route.children)
        // 外链
      } else if (isUrl(route.path)) {
        data = {
          path: '/external-link',
          component: Layout,
          meta: {
            name: route.name
          },
          children: [data]
        } as AppRouteRecordRaw
        // 菜单
      } else {
        // 对后端传component组件路径和不传做兼容（如果后端传component组件路径，那么path可以随便写，如果不传，component组件路径会根path保持一致）
        const index = route?.component
          ? modulesRoutesKeys.findIndex((ev) => ev.includes(route.component))
          : modulesRoutesKeys.findIndex((ev) => ev.includes(route.path))
        data.component = modules[modulesRoutesKeys[index]]
      }
      if (route.children) {
        data.children = generateRoute(route.children)
      }
    }
    res.push(data as AppRouteRecordRaw)
  }
  console.log('✅ 生成的路由名称列表:', Array.from(nameCountMap.keys()))
  return res
}
export const getRedirect = (parentPath: string, children: AppCustomRouteRecordRaw[]) => {
  if (!children || children.length == 0) {
    return parentPath
  }
  const path = generateRoutePath(parentPath, children[0].path)
  // 递归子节点
  if (children[0].children) return getRedirect(path, children[0].children)
}
const generateRoutePath = (parentPath: string, path: string) => {
  if (parentPath.endsWith('/')) {
    parentPath = parentPath.slice(0, -1) // 移除默认的 /
  }
  if (!path.startsWith('/')) {
    path = '/' + path
  }
  return parentPath + path
}
export const pathResolve = (parentPath: string, path: string) => {
  if (isUrl(path)) return path
  const childPath = path.startsWith('/') || !path ? path : `/${path}`
  return `${parentPath}${childPath}`.replace(/\/\//g, '/')
}

// 路由降级
export const flatMultiLevelRoutes = (routes: AppRouteRecordRaw[]) => {
  console.group('🔄 路由扁平化 - 全局名称检查开始')

  // ✅ 添加全局名称去重逻辑
  const globalNameMap = new Map()
  let renameCount = 0

  function ensureUniqueNames(route: AppRouteRecordRaw) {
    if (route.name) {
      const originalName = route.name.toString()
      if (globalNameMap.has(originalName)) {
        let newName = originalName
        let counter = 1
        while (globalNameMap.has(newName)) {
          newName = `${originalName}${counter}`
          counter++
        }
        console.warn(`🔄 全局重命名: ${originalName} → ${newName}`)
        route.name = newName
        renameCount++
      }
      globalNameMap.set(route.name, true)
    }

    if (route.children) {
      route.children.forEach(child => ensureUniqueNames(child))
    }
  }

  // 深拷贝后再处理
  const modules: AppRouteRecordRaw[] = cloneDeep(routes)
  modules.forEach(route => ensureUniqueNames(route))

  console.log(`✅ 完成重命名 ${renameCount} 个路由`)
  console.log('最终路由名称列表:', Array.from(globalNameMap.keys()))

  for (let index = 0; index < modules.length; index++) {
    const route = modules[index]
    if (!isMultipleRoute(route)) {
      continue
    }
    promoteRouteLevel(route)
  }

  console.groupEnd()
  return modules
}

// 层级是否大于2
const isMultipleRoute = (route: AppRouteRecordRaw) => {
  if (!route || !Reflect.has(route, 'children') || !route.children?.length) {
    return false
  }

  const children = route.children

  let flag = false
  for (let index = 0; index < children.length; index++) {
    const child = children[index]
    if (child.children?.length) {
      flag = true
      break
    }
  }
  return flag
}

// 生成二级路由
const promoteRouteLevel = (route: AppRouteRecordRaw) => {
  let router: Router | null = createRouter({
    routes: [route as RouteRecordRaw],
    history: createWebHashHistory()
  })

  const routes = router.getRoutes()
  addToChildren(routes, route.children || [], route)
  router = null

  route.children = route.children?.map((item) => omit(item, 'children'))
}

// 添加所有子菜单
const addToChildren = (
  routes: RouteRecordNormalized[],
  children: AppRouteRecordRaw[],
  routeModule: AppRouteRecordRaw
) => {
  // ✅ 在函数内部维护名称集合
  const localNameSet = new Set()

  for (let index = 0; index < children.length; index++) {
    const child = children[index]
    const route = routes.find((item) => item.name === child.name)
    if (!route) {
      continue
    }
    routeModule.children = routeModule.children || []

    // ✅ 加强检查：本地 + 全局
    const existingRoute = routeModule.children.find((item) => item.name === route.name)
    if (existingRoute || localNameSet.has(route.name)) {
      console.warn(`🚨 跳过重复路由: ${route.name}，父路由: ${routeModule.name}`)
      // 即使跳过当前路由，也要继续处理它的子路由
      if (child.children?.length) {
        addToChildren(routes, child.children, routeModule)
      }
      continue
    }

    localNameSet.add(route.name)
    routeModule.children?.push(route as unknown as AppRouteRecordRaw)

    if (child.children?.length) {
      addToChildren(routes, child.children, routeModule)
    }
  }
}
const toCamelCase = (str: string, upperCaseFirst: boolean) => {
  str = (str || '')
    .replace(/-(.)/g, function (group1: string) {
      return group1.toUpperCase()
    })
    .replaceAll('-', '')

  if (upperCaseFirst && str) {
    str = str.charAt(0).toUpperCase() + str.slice(1)
  }

  return str
}
