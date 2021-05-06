import { forEach, hasOneOf, objEqual } from '@/utils/tools'

export const hasChild = (item: any) => {
  return item.children && item.children.length !== 0
}

const showThisMenuEle = (item:MenuItem, access:Array<String|Number>) => {
  if (item.meta && item.meta.access && item.meta.access.length) {
    // @ts-ignore
    if (hasOneOf(item.meta.access, access)){
      return true
    } else {
      return false
    }
  } else {
    return true
  }
}
/**
 * @param {Array} list 通过路由列表得到菜单列表
 * @param access
 * @returns {Array}
 */
export const getMenuByRouter = (list: Array<MenuItem>, access: Array<String|Number>): Array<MenuItem> => {
  let res: any[] | never[] | { icon: any; name: any; meta: any; }[] = []
  forEach(list, (item:MenuItem) => {
    if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
      let obj:MenuItem = {
        icon: (item.meta && item.meta.icon) || '',
        name: item.name,
        meta: item.meta
      }
      if ((hasChild(item) || (item.meta && item.meta.showAlways)) && showThisMenuEle(item, access)) {
        // @ts-ignore
        obj.children = getMenuByRouter(item.children, access)
      }
      if (item.meta && item.meta.href) {
        // @ts-ignore
        obj.href = item.meta.href
      }
      if (showThisMenuEle(item, access)) {
        // @ts-ignore
        res.push(obj)
      }
    }
  })
  return res
}

/**
 * @returns {Array} routeMetched 当前路由metched
 * @param route
 * @param homeRoute
 */
export const getBreadCrumbList = (route: { matched: any; }, homeRoute: { meta: { icon: any; }; name: any; path: any; }) => {
  let homeItem = { ...homeRoute, icon: homeRoute.meta.icon }
  let routeMetched = route.matched
  if (routeMetched.some((item: { name: any; }) => item.name === homeRoute.name)) {
    return [homeItem]
  }
  let res = routeMetched.filter((item: { meta: { hideInBread: any; } | undefined; }) => {
    return item.meta === undefined || !item.meta.hideInBread
  }).map((item: any) => {
    let meta = { ...item.meta }
    if (meta.title && typeof meta.title === 'function') {
      meta.__titleIsFunction__ = true
      meta.title = meta.title(route)
    }
    let obj = {
      icon: (item.meta && item.meta.icon) || '',
      name: item.name,
      meta: meta
    }
    return obj
  })
  res = res.filter((item: { meta: { hideInMenu: any; }; }) => {
    return !item.meta.hideInMenu
  })
  return [{ ...homeItem, to: homeRoute.path }, ...res]
}

export const getRouteTitleHandled = (route: { meta: any; }) => {
  let router = { ...route }
  let meta = { ...route.meta }
  let title = ''
  if (meta.title) {
    if (typeof meta.title === 'function') {
      meta.__titleIsFunction__ = true
      title = meta.title(router)
    } else {
      title = meta.title
    }
  }
  meta.title = title
  router.meta = meta
  return router
}

export const showTitle = (item: any, vm: any) => {
  let { title, __titleIsFunction__ } = item.meta
  if (!title) {
    return
  }
  title = (item.meta && item.meta.title) || item.name
  return title
}

/**
 * @description 本地存储和获取标签导航列表
 */
export const setTagNavListInLocalstorage = (list: any) => {
  localStorage.tagNaveList = JSON.stringify(list)
}
/**
 * @returns {Array} 其中的每个元素只包含路由原信息中的name, path, meta三项
 */
export const getTagNavListFromLocalstorage = () => {
  const list = localStorage.tagNaveList
  return list ? JSON.parse(list) : []
}


/**
 * @param {Array} routers 路由列表数组
 * @description 用于找到路由列表中name为home的对象
 */
// @ts-ignore
export const getHomeRoute = (routers, homeName = 'home') => {
  let i = -1
  let len = routers.length
  let homeRoute = {}
  while (++i < len) {
    let item = routers[i]
    if (item.children && item.children.length) {
      // @ts-ignore
      let res = getHomeRoute(item.children, homeName)
      if (res.name) {
        return res
      }
    } else {
      if (item.name === homeName) {
        homeRoute = item
      }
    }
  }
  return homeRoute
}

/**
 * @param {*} list 现有标签导航列表
 * @param {*} newRoute 新添加的路由原信息对象
 * @description 如果该newRoute已经存在则不再添加
 */
export const getNewTagList = (list: any, newRoute: { name: any; path: any; meta: any; }) => {
  const { name, path, meta } = newRoute
  let newList = [...list]
  if (newList.findIndex(item => item.name === name) >= 0) {
    return newList
  } else {
    newList.push({ name, path, meta })
  }
  return newList
}

/**
 * @param {*} access 用户权限数组，如 ['super_admin', 'admin']
 * @param {*} route 路由列表
 */
const hasAccess = (access: Array<String|Number>, route: { meta: { access: Array<String|Number>}}) => {
  if (route.meta && route.meta.access) {
    return hasOneOf(access, route.meta.access)
  } else {
    return true
  }
}

/**
 * 权鉴
 * @param {*} name 即将跳转的路由name
 * @param {*} access 用户权限数组
 * @param {*} routes 路由列表
 * @description 用户是否可跳转到该页
 */
export const canTurnTo = (name: String, access: Array<String|Number>, routes: any) => {
  // @ts-ignore
  const routePermissionJudge = (list: { some: (arg0: (item: any) => any) => void; }) => {
    return list.some(item => {
      if (item.children && item.children.length) {
        return routePermissionJudge(item.children)
      } else if (item.name === name) {
        return hasAccess(access, item)
      }
    })
  }

  return routePermissionJudge(routes)
}

/**
 * @param {String} url
 * @description 从URL中解析参数
 */
export const getParams = (url: { split: (arg0: string) => { split: (arg0: string) => void; }[]; }) => {
  const keyValueArr = url.split('?')[1].split('&')
  let paramObj = {}
  // @ts-ignore
  keyValueArr.forEach((item) => {
    const keyValue = item.split('=')
    // @ts-ignore
    paramObj[keyValue[0]] = keyValue[1]
  })
  return paramObj
}

/**
 * @param {Array} list 标签列表
 * @param route
 */
export const getNextRoute = (list: {}[], route: any) => {
  let res = {}
  if (list.length === 2) {
    res = getHomeRoute(list)
  } else {
    const index = list.findIndex(item => routeEqual(item, route))
    if (index === list.length - 1) {
      res = list[list.length - 2]
    } else {
      res = list[index + 1]
    }
  }
  return res
}

/**
 * @param {Number} times 回调函数需要执行的次数
 * @param {Function} callback 回调函数
 */
export const doCustomTimes = (times: number, callback: Function):void => {
  let i = -1
  while (++i < times) {
    // eslint-disable-next-line callback-return
    callback(i)
  }
}

/**
 * @param {Object} file 从上传组件得到的文件对象
 * @returns {Promise} resolve参数是解析后的二维数组
 * @description 从Csv文件中解析出表格，解析成二维数组
 */
export const getArrayFromFile = (file: any) => {
  let nameSplit = file.name.split('.')
  let format = nameSplit[nameSplit.length - 1]
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.readAsText(file) // 以文本格式读取
    let arr = []
    reader.onload = function (evt:any) {
      let data = evt.target.result // 读到的数据
      let pasteData = data.trim()
      arr = pasteData.split((/[\n\u0085\u2028\u2029]|\r\n?/g)).map((row:string) => {
        return row.split('\t')
      }).map((item:Array<string>) => {
        return item[0].split(',')
      })
      if (format === 'csv') {
        resolve(arr)
      } else {
        reject(new Error('[Format Error]:你上传的不是Csv文件'))
      }
    }
  })
}

/**
 * @param {Array} array 表格数据二维数组
 * @returns {Object} { columns, tableData }
 * @description 从二维数组中获取表头和表格数据，将第一行作为表头，用于在iView的表格中展示数据
 */
export const getTableDataFromArray = (array:Array<any>) => {
  let columns = []
  let tableData: never[] | {}[] = []
  if (array.length > 1) {
    let titles = array.shift()
    columns = titles.map((item:any) => {
      return {
        title: item,
        key: item
      }
    })
    tableData = array.map(item => {
      let res = {}
      item.forEach((col: any, i: string | number) => {
        // @ts-ignore
        res[titles[i]] = col
      })
      return res
    })
  }
  return {
    columns,
    tableData
  }
}

// @ts-ignore
export const findNodeUpper = (ele, tag) => {
  if (ele.parentNode) {
    if (ele.parentNode.tagName === tag.toUpperCase()) {
      return ele.parentNode
    } else {
      return findNodeUpper(ele.parentNode, tag)
    }
  }
}

// @ts-ignore
export const findNodeUpperByClasses = (ele, classes) => {
  let parentNode = ele.parentNode
    if (parentNode) {
      let classList = parentNode.classList
      if (classList && classes.every((className: any) => classList.contains(className))) {
        return parentNode
      } else {
        return findNodeUpperByClasses(parentNode, classes)
      }
    }
}

// @ts-ignore
export const findNodeDownward = (ele, tag) => {
  const tagName = tag.toUpperCase()
  if (ele.childNodes.length) {
    let i = -1
    let len = ele.childNodes.length
    while (++i < len) {
      let child = ele.childNodes[i]
      if (child.tagName === tagName) {
        return child
      } else {
        return findNodeDownward(child, tag)
      }
    }
  }
}

export const showByAccess = (access:any, canViewAccess:any) => {
  return hasOneOf(canViewAccess, access)
}

/**
 * @description 根据name/params/query判断两个路由对象是否相等
 * @param {*} route1 路由对象
 * @param {*} route2 路由对象
 */
export const routeEqual = (route1: { params?: any; query?: any; name?: any; }, route2: { params: {}; query: {}; name: any; }) => {
  const params1 = route1.params || {}
  const params2 = route2.params || {}
  const query1 = route1.query || {}
  const query2 = route2.query || {}
  return (route1.name === route2.name) && objEqual(params1, params2) && objEqual(query1, query2)
}

/**
 * 判断打开的标签列表里是否已存在这个新添加的路由对象
 */
export const routeHasExist = (tagNavList: { [x: string]: { params?: any; query?: any; name?: any; }; length: any; }, routeItem: { params: {}; query: {}; name: any; }) => {
  let len = tagNavList.length
  let res = false
  doCustomTimes(len, (index: string | number) => {
    if (routeEqual(tagNavList[index], routeItem)) {
      res = true
    }
  })
  return res
}

export const localSave = (key: string, value: string) => {
  localStorage.setItem(key, value)
}

export const localRead = (key: string) => {
  return localStorage.getItem(key) || ''
}

// scrollTop animation
export const scrollTop = (el: Window, from = 0, to: number, duration = 500, endCallback: () => void) => {
  if (!window.requestAnimationFrame) {

    window.requestAnimationFrame = (
      window.webkitRequestAnimationFrame ||
      // @ts-ignore
      window.mozRequestAnimationFrame ||
      // @ts-ignore
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60)
      }
    )
  }
  const difference = Math.abs(from - to)
  const step:number = Math.ceil(difference / duration * 50)
  // eslint-disable-next-line no-shadow
  const scroll = (start: number, end: number, step: number) => {
    if (start === end) {
      endCallback && endCallback()
      return
    }

    let d = (start + step > end) ? end : start + step
    if (start > end) {
      d = (start - step < end) ? end : start - step
    }

    if (el === window) {
      window.scrollTo(d, d)
    } else {
      // @ts-ignore
      el.scrollTop = d
    }
    window.requestAnimationFrame(() => scroll(d, end, step))
  }
  scroll(from, to, step)
}

/**
 * @description 根据当前跳转的路由设置显示在浏览器标签的title
 * @param {Object} routeItem 路由对象
 * @param {Object} vm Vue实例
 */
export const setTitle = (routeItem: { meta: any; }, vm: any) => {
  const handledRoute = getRouteTitleHandled(routeItem)
  const pageTitle = showTitle(handledRoute, vm)
  const resTitle = pageTitle ? `${process.env.VUE_APP_PROJECT_TITLE} - ${pageTitle}` : process.env.VUE_APP_PROJECT_TITLE
  //window.document.title = resTitle
}
