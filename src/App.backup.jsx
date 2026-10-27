import { useMemo, useRef, useState } from 'react'
import {
  Search,
  Plus,
  Heart,
  LayoutGrid,
  UsersRound,
  Sparkles,
  Settings2,
  Bell,
  ChevronDown,
  SlidersHorizontal,
  Menu,
  X,
  UploadCloud,
  Shirt,
  Check,
  UserRound,
  ArrowUpRight,
  Trash2,
  Camera,
  ShoppingBag,
} from 'lucide-react'

const categories = [
  'All Clothes',
  'Tops',
  'Shirts',
  'Jeans',
  'Pants',
  'Kurtis',
  'Suits',
  'Sarees',
  'Dresses',
  'Other',
]

const familyMembers = [
  { id: 'all', name: 'Everyone', emoji: '👨‍👩‍👧‍👦', color: 'bg-amber-100' },
  { id: 'me', name: 'My Wardrobe', emoji: '👩🏻', color: 'bg-rose-100' },
  { id: 'mom', name: 'Mom', emoji: '👩🏻‍🦳', color: 'bg-orange-100' },
  { id: 'sister', name: 'Sister', emoji: '👧🏻', color: 'bg-purple-100' },
  { id: 'brother', name: 'Brother', emoji: '👦🏻', color: 'bg-blue-100' },
  {id: 'dad', name: 'Dad', emoji: '👨🏻', color: 'bg-green-100' },
]

const initialClothes = [
  {
    id: 1,
    name: 'Everyday White Shirt',
    category: 'Shirts',
    color: 'White',
    occasion: 'Casual',
    owner: 'me',
    favorite: true,
    image:
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 2,
    name: 'Classic Blue Jeans',
    category: 'Jeans',
    color: 'Blue',
    occasion: 'Casual',
    owner: 'me',
    favorite: false,
    image:
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 3,
    name: 'Floral Summer Dress',
    category: 'Dresses',
    color: 'Pink',
    occasion: 'Outing',
    owner: 'me',
    favorite: true,
    image:
      'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 4,
    name: 'Everyday Beige Top',
    category: 'Tops',
    color: 'Beige',
    occasion: 'Casual',
    owner: 'me',
    favorite: false,
    image:
      'https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 5,
    name: 'Elegant Evening Outfit',
    category: 'Suits',
    color: 'Black',
    occasion: 'Party',
    owner: 'mom',
    favorite: false,
    image:
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 6,
    name: 'Weekend Denim',
    category: 'Jeans',
    color: 'Blue',
    occasion: 'Casual',
    owner: 'brother',
    favorite: false,
    image:
      'https://images.unsplash.com/photo-1511196044526-5cb3bcb7071b?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 7,
    name: 'Soft Pink Outfit',
    category: 'Tops',
    color: 'Pink',
    occasion: 'Casual',
    owner: 'sister',
    favorite: true,
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 8,
    name: 'Classic Daily Shirt',
    category: 'Shirts',
    color: 'Cream',
    occasion: 'Work',
    owner: 'me',
    favorite: false,
    image:
      'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 9,
    name: "Dad's Casual Shirt",
    category: 'Shirts',
    color: 'Blue',
    occasion: 'Casual',
    owner: 'dad',
    favorite: false,
    image:
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=700&q=85',
  },
]

const categoryIcons = {
  'All Clothes': LayoutGrid,
  Tops: Shirt,
  Shirts: Shirt,
  Jeans: ShoppingBag,
  Pants: ShoppingBag,
  Kurtis: Shirt,
  Suits: Sparkles,
  Sarees: Sparkles,
  Dresses: Shirt,
  Other: ShoppingBag,
}

const emptyForm = {
  name: '',
  category: 'Tops',
  color: '',
  occasion: 'Casual',
  owner: 'me',
}

function App() {
  const [clothes, setClothes] = useState(initialClothes)
  const [activeCategory, setActiveCategory] = useState('All Clothes')
  const [activeOwner, setActiveOwner] = useState('all')
  const [activePage, setActivePage] = useState('wardrobe')
  const [search, setSearch] = useState('')
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [photo, setPhoto] = useState('')
  const [formError, setFormError] = useState('')
  const [selectedCloth, setSelectedCloth] = useState(null)
  const fileInputRef = useRef(null)

  const currentOwner = familyMembers.find(
    (member) => member.id === activeOwner,
  )

  const visibleClothes = useMemo(() => {
    return clothes.filter((item) => {
      const matchesCategory =
        activeCategory === 'All Clothes' ||
        item.category === activeCategory

      const matchesOwner =
        activeOwner === 'all' || item.owner === activeOwner

      const matchesSearch =
        `${item.name} ${item.category} ${item.color} ${item.occasion}`
          .toLowerCase()
          .includes(search.toLowerCase().trim())

      const matchesFavorite = !favoritesOnly || item.favorite

      const matchesPage =
        activePage !== 'family' || activeOwner !== 'all'
          ? true
          : true

      return (
        matchesCategory &&
        matchesOwner &&
        matchesSearch &&
        matchesFavorite &&
        matchesPage
      )
    })
  }, [
    clothes,
    activeCategory,
    activeOwner,
    search,
    favoritesOnly,
    activePage,
  ])

  const myClothes = clothes.filter((item) => item.owner === 'me')
  const favoriteCount = clothes.filter((item) => item.favorite).length

  function openAddModal() {
    setForm({
      ...emptyForm,
      owner: activeOwner === 'all' ? 'me' : activeOwner,
    })
    setPhoto('')
    setFormError('')
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setPhoto('')
    setFormError('')
  }

  function handlePhotoChange(event) {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      setFormError('Please select an image file.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setFormError('Please select an image smaller than 5 MB.')
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      setPhoto(reader.result)
      setFormError('')
    }

    reader.onerror = () => {
      setFormError('Unable to read this image. Please try again.')
    }

    reader.readAsDataURL(file)
  }

  function handleAddCloth(event) {
    event.preventDefault()

    if (!form.name.trim()) {
      setFormError('Please enter a name for your clothing item.')
      return
    }

    if (!photo) {
      setFormError('Please upload a photo of your clothing item.')
      return
    }

    const newCloth = {
      id: Date.now(),
      name: form.name.trim(),
      category: form.category,
      color: form.color.trim() || 'Not specified',
      occasion: form.occasion,
      owner: form.owner,
      favorite: false,
      image: photo,
    }

    setClothes((previous) => [newCloth, ...previous])
    setActiveCategory('All Clothes')
    setActiveOwner(form.owner)
    setActivePage('wardrobe')
    setFavoritesOnly(false)
    setSearch('')
    closeModal()
  }

  function toggleFavorite(id) {
    setClothes((previous) =>
      previous.map((item) =>
        item.id === id
          ? { ...item, favorite: !item.favorite }
          : item,
      ),
    )

    setSelectedCloth((previous) =>
      previous?.id === id
        ? { ...previous, favorite: !previous.favorite }
        : previous,
    )
  }

  function deleteCloth(id) {
    setClothes((previous) => previous.filter((item) => item.id !== id))
    setSelectedCloth(null)
  }

  function selectPage(page) {
    setActivePage(page)
    setMobileMenu(false)
    setFavoritesOnly(page === 'favorites')

    if (page === 'family') {
      setActiveOwner('all')
      setActiveCategory('All Clothes')
    } else if (page === 'wardrobe' || page === 'favorites') {
      setActiveCategory('All Clothes')
    }
  }

  const pageTitle =
    activePage === 'favorites'
      ? 'Your favourites'
      : activePage === 'family'
        ? 'Family wardrobe'
        : activeOwner === 'all'
          ? 'Your wardrobe, your style.'
          : `${currentOwner?.name ?? 'My'}'s wardrobe`

  const pageDescription =
    activePage === 'favorites'
      ? 'All the pieces you love, in one place.'
      : activePage === 'family'
        ? 'Everyone’s collection, beautifully organised.'
        : 'Every piece you own, just a little easier to find.'

  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-800">
      {/* Mobile header */}
      <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between border-b border-stone-200/80 bg-[#faf9f6]/95 px-5 backdrop-blur lg:hidden">
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="rounded-xl p-2 hover:bg-stone-100"
          aria-label="Toggle menu"
        >
          {mobileMenu ? <X size={22} /> : <Menu size={22} />}
        </button>

        <button
          onClick={() => selectPage('wardrobe')}
          className="flex items-center gap-2"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-stone-900 text-white">
            <Shirt size={17} />
          </span>
          <span className="text-lg font-semibold tracking-tight">
            wardrobe<span className="text-amber-700">.</span>
          </span>
        </button>

        <button
          onClick={openAddModal}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-white"
          aria-label="Add clothing"
        >
          <Plus size={21} />
        </button>
      </header>

      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        {/* Sidebar */}
        <aside
          className={`${
            mobileMenu ? 'translate-x-0' : '-translate-x-full'
          } fixed inset-y-0 left-0 z-40 flex w-[280px] flex-col border-r border-stone-200/80 bg-[#faf9f6] px-6 pb-6 pt-7 transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:w-[258px] lg:shrink-0 lg:translate-x-0`}
        >
          <button
            onClick={() => selectPage('wardrobe')}
            className="mb-12 flex items-center gap-3 text-left"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-900 text-white shadow-sm">
              <Shirt size={21} />
            </span>
            <span>
              <span className="block text-[21px] font-semibold tracking-tight text-stone-900">
                wardrobe<span className="text-amber-700">.</span>
              </span>
              <span className="block text-[10px] font-medium uppercase tracking-[2.5px] text-stone-400">
                Your personal closet
              </span>
            </span>
          </button>

          <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[2px] text-stone-400">
            Workspace
          </div>

          <nav className="space-y-1">
            <SidebarItem
              icon={LayoutGrid}
              label="My wardrobe"
              active={activePage === 'wardrobe'}
              onClick={() => selectPage('wardrobe')}
            />

            <SidebarItem
              icon={Heart}
              label="Favourites"
              active={activePage === 'favorites'}
              count={favoriteCount}
              onClick={() => selectPage('favorites')}
            />

            <SidebarItem
              icon={Sparkles}
              label="Outfit ideas"
              active={activePage === 'outfits'}
              onClick={() => {
                selectPage('outfits')
                setMobileMenu(false)
              }}
            />

            <SidebarItem
              icon={UsersRound}
              label="Family wardrobe"
              active={activePage === 'family'}
              onClick={() => selectPage('family')}
            />
          </nav>

          <div className="mb-3 mt-10 flex items-center justify-between px-3">
            <span className="text-[10px] font-semibold uppercase tracking-[2px] text-stone-400">
              Family members
            </span>

            <UsersRound size={14} className="text-stone-400" />
          </div>

          <div className="space-y-1">
            {familyMembers.map((member) => (
              <button
                key={member.id}
                onClick={() => {
                  setActiveOwner(member.id)
                  setActivePage('wardrobe')
                  setActiveCategory('All Clothes')
                  setFavoritesOnly(false)
                  setMobileMenu(false)
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                  activeOwner === member.id && activePage === 'wardrobe'
                    ? 'bg-white shadow-sm ring-1 ring-stone-200'
                    : 'hover:bg-white/70'
                }`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl text-lg ${member.color}`}
                >
                  {member.emoji}
                </span>

                <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-stone-700">
                  {member.name}
                </span>

                {activeOwner === member.id && activePage === 'wardrobe' && (
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-700" />
                )}
              </button>
            ))}
          </div>

          <div className="mt-auto">
            <div className="mb-5 rounded-2xl border border-amber-200/70 bg-[#f5efe3] p-4">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-amber-800">
                <Sparkles size={18} />
              </div>

              <p className="text-sm font-semibold text-stone-800">
                A little closet magic
              </p>

              <p className="mt-1 text-xs leading-5 text-stone-500">
                Every piece has a place. Find yours without unfolding a thing.
              </p>
            </div>

            <button
              onClick={() => {
                setActivePage('settings')
                setMobileMenu(false)
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm ${
                activePage === 'settings'
                  ? 'bg-white text-stone-900'
                  : 'text-stone-500 hover:bg-white'
              }`}
            >
              <Settings2 size={18} />
              Settings
            </button>

            <div className="mt-4 flex items-center gap-3 border-t border-stone-200 pt-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-lg">
                👩🏻
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-stone-800">
                  My account
                </p>
                <p className="text-xs text-stone-400">Personal wardrobe</p>
              </div>

              <ChevronDown size={16} className="text-stone-400" />
            </div>
          </div>
        </aside>

        {mobileMenu && (
          <button
            aria-label="Close navigation"
            onClick={() => setMobileMenu(false)}
            className="fixed inset-0 z-30 bg-stone-900/30 lg:hidden"
          />
        )}

        {/* Main content */}
        <main className="min-w-0 flex-1 px-5 pb-12 sm:px-8 lg:px-10 lg:pt-7 xl:px-12">
          {/* Top navigation */}
          <div className="hidden items-center justify-between border-b border-stone-200/80 pb-5 lg:flex">
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <span>Workspace</span>
              <span>/</span>
              <span className="font-medium text-stone-700">
                {activePage === 'favorites'
                  ? 'Favourites'
                  : activePage === 'family'
                    ? 'Family wardrobe'
                    : 'My wardrobe'}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-[11px] font-medium text-stone-500">
                <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Your closet, organised
              </span>

              <button
                className="relative rounded-xl p-2.5 text-stone-500 transition hover:bg-white"
                aria-label="Notifications"
              >
                <Bell size={18} />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-amber-600" />
              </button>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 text-lg">
                👩🏻
              </div>
            </div>
          </div>

          {/* Welcome section */}
          <section className="pb-7 pt-8 sm:pt-10">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <div className="mb-3 flex items-center gap-2 text-xs font-medium text-amber-800">
                  <Sparkles size={14} />
                  YOUR LITTLE SPACE OF STYLE
                </div>

                <h1 className="max-w-2xl text-[32px] font-semibold leading-tight tracking-[-1.5px] text-stone-900 sm:text-[40px]">
                  {pageTitle}
                </h1>

                <p className="mt-3 max-w-lg text-sm leading-6 text-stone-500 sm:text-[15px]">
                  {pageDescription}
                </p>
              </div>

              <button
                onClick={openAddModal}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-stone-700"
              >
                <Plus size={18} />
                Add new clothes
              </button>
            </div>
          </section>

          {/* Stats */}
          <section className="mb-8 grid grid-cols-2 gap-3 xl:grid-cols-4">
            <StatCard
              icon={Shirt}
              label="Total pieces"
              value={clothes.length}
              detail="Across the collection"
            />

            <StatCard
              icon={Heart}
              label="Favourites"
              value={favoriteCount}
              detail="Your most-loved pieces"
            />

            <StatCard
              icon={UsersRound}
              label="Family members"
              value={familyMembers.length - 1}
              detail="In your family list"
            />

            <StatCard
              icon={Sparkles}
              label="Your collection"
              value={myClothes.length}
              detail="Pieces in your wardrobe"
            />
          </section>

          {/* Family banner */}
          <section className="mb-8 overflow-hidden rounded-2xl border border-[#e9ddca] bg-[#f3ecdf]">
            <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                  🏡
                </div>

                <div>
                  <p className="text-base font-semibold text-stone-800">
                    One family. Everyone&apos;s wardrobe.
                  </p>

                  <p className="mt-1 max-w-md text-sm leading-6 text-stone-500">
                    Keep track of everyone&apos;s clothes in one organised place.
                    No more searching through shelves.
                  </p>

                  <div className="mt-4 flex items-center gap-2">
                    {familyMembers.slice(1).map((member) => (
                      <span
                        key={member.id}
                        title={member.name}
                        className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#f3ecdf] text-sm ${member.color}`}
                      >
                        {member.emoji}
                      </span>
                    ))}

                    <span className="ml-1 text-xs text-stone-500">
                      Your family collection
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => selectPage('family')}
                className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-stone-300/80 bg-white px-4 py-3 text-sm font-medium text-stone-700 transition hover:border-stone-400 sm:self-center"
              >
                Explore family
                <ArrowUpRight size={16} />
              </button>
            </div>
          </section>

          {/* Category navigation */}
          <section className="mb-7">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-stone-900">
                Browse categories
              </h2>

              <span className="text-xs text-stone-400">
                Find your favourite pieces
              </span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => {
                const Icon = categoryIcons[category] || Shirt
                const active = activeCategory === category

                return (
                  <button
                    key={category}
                    onClick={() => {
                      setActiveCategory(category)
                      setActivePage('wardrobe')
                      setFavoritesOnly(false)
                    }}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-medium transition ${
                      active
                        ? 'border-stone-900 bg-stone-900 text-white'
                        : 'border-stone-200 bg-white text-stone-600 hover:border-stone-400'
                    }`}
                  >
                    <Icon size={15} />
                    {category}
                  </button>
                )
              })}
            </div>
          </section>

          {/* Gallery toolbar */}
          <section>
            <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-stone-900">
                  {activePage === 'favorites'
                    ? 'Your favourite pieces'
                    : activePage === 'outfits'
                      ? 'Outfit inspiration'
                      : activePage === 'settings'
                        ? 'Your settings'
                        : activeCategory === 'All Clothes'
                          ? 'Your collection'
                          : activeCategory}
                </h2>

                <p className="mt-1 text-xs text-stone-400">
                  {activePage === 'settings'
                    ? 'Personalise your wardrobe experience.'
                    : `${visibleClothes.length} ${
                        visibleClothes.length === 1 ? 'piece' : 'pieces'
                      } to explore`}
                </p>
              </div>

              <div className="flex flex-col gap-2 min-[420px]:flex-row">
                <div className="relative min-w-0 flex-1 sm:w-[235px] sm:flex-none">
                  <Search
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
                  />

                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search your clothes..."
                    className="h-11 w-full rounded-xl border border-stone-200 bg-white pl-10 pr-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-stone-400"
                  />
                </div>

                <button
                  onClick={() => {
                    setActiveCategory('All Clothes')
                    setActiveOwner('all')
                    setActivePage('wardrobe')
                    setFavoritesOnly(false)
                    setSearch('')
                  }}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 text-sm text-stone-600 transition hover:border-stone-400"
                >
                  <SlidersHorizontal size={16} />
                  Reset filters
                </button>
              </div>
            </div>

            {/* Clothing grid */}
            {activePage === 'settings' ? (
              <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
                <h3 className="font-semibold text-stone-900">
                  Wardrobe preferences
                </h3>
                <p className="mt-2 text-sm leading-6 text-stone-500">
                  Your wardrobe currently runs locally in this browser. Account
                  management, permanent storage and family sharing will be
                  configured in a later step.
                </p>
                <button
                  onClick={() => selectPage('wardrobe')}
                  className="mt-5 rounded-xl bg-stone-900 px-4 py-3 text-sm font-medium text-white"
                >
                  Back to wardrobe
                </button>
              </div>
            ) : activePage === 'outfits' ? (
              <div className="rounded-2xl border border-stone-200 bg-white p-7 sm:p-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-800">
                  <Sparkles size={26} />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-stone-900">
                  Your next favourite outfit starts here.
                </h3>
                <p className="mt-2 max-w-lg text-sm leading-6 text-stone-500">
                  We&apos;ll build outfit suggestions from your own clothes in a
                  future step. For now, explore your collection and save the
                  pieces you love.
                </p>
                <button
                  onClick={() => selectPage('wardrobe')}
                  className="mt-5 rounded-xl bg-stone-900 px-4 py-3 text-sm font-medium text-white"
                >
                  Explore my clothes
                </button>
              </div>
            ) : visibleClothes.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-4">
                {visibleClothes.map((item) => {
                  const owner = familyMembers.find(
                    (member) => member.id === item.owner,
                  )

                  return (
                    <article
                      key={item.id}
                      className="group min-w-0 overflow-hidden rounded-2xl border border-stone-200/80 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-stone-200/50"
                    >
                      <button
                        onClick={() => setSelectedCloth(item)}
                        className="relative block aspect-[4/5] w-full overflow-hidden bg-stone-100 text-left"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />

                        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1.5 text-[10px] font-medium text-stone-700 shadow-sm">
                          {item.category}
                        </span>

                        <span
                          onClick={(event) => {
                            event.stopPropagation()
                            toggleFavorite(item.id)
                          }}
                          role="button"
                          tabIndex={0}
                          aria-label={
                            item.favorite
                              ? 'Remove from favourites'
                              : 'Add to favourites'
                          }
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault()
                              event.stopPropagation()
                              toggleFavorite(item.id)
                            }
                          }}
                          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full shadow-sm transition ${
                            item.favorite
                              ? 'bg-rose-50 text-rose-600'
                              : 'bg-white/95 text-stone-500 hover:text-rose-500'
                          }`}
                        >
                          <Heart
                            size={17}
                            fill={item.favorite ? 'currentColor' : 'none'}
                          />
                        </span>

                        <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1.5 text-[10px] font-medium text-stone-600 shadow-sm">
                          <span className="text-sm">{owner?.emoji || '👗'}</span>
                          {owner?.name || 'My Wardrobe'}
                        </span>
                      </button>

                      <div className="p-3.5 sm:p-4">
                        <button
                          onClick={() => setSelectedCloth(item)}
                          className="block w-full truncate text-left text-sm font-semibold text-stone-800 hover:text-amber-800"
                        >
                          {item.name}
                        </button>

                        <div className="mt-2 flex items-center justify-between gap-2">
                          <span className="truncate text-xs text-stone-400">
                            {item.color}
                          </span>

                          <span className="shrink-0 rounded-full bg-stone-100 px-2 py-1 text-[10px] text-stone-500">
                            {item.occasion}
                          </span>
                        </div>
                      </div>
                    </article>
                  )
                })}

                {/* Add new item card */}
                <button
                  onClick={openAddModal}
                  className="flex aspect-[4/5] min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white/50 p-5 text-center transition hover:border-amber-700 hover:bg-amber-50/40"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-stone-600 transition group-hover:bg-amber-100">
                    <Plus size={23} />
                  </span>
                  <span className="mt-4 text-sm font-semibold text-stone-700">
                    Add a new piece
                  </span>
                  <span className="mt-1 text-xs leading-5 text-stone-400">
                    Give your next outfit a home
                  </span>
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-5 py-14 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-800">
                  <Shirt size={26} />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-stone-800">
                  Nothing here just yet
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-stone-500">
                  Try another category or add a clothing item to start building
                  your collection.
                </p>

                <button
                  onClick={openAddModal}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-stone-900 px-5 py-3 text-sm font-medium text-white"
                >
                  <Plus size={17} />
                  Add clothes
                </button>
              </div>
            )}
          </section>

          <footer className="mt-12 border-t border-stone-200 pt-5 text-center text-xs text-stone-400">
            Made with love for your wardrobe. <span>♥</span>
          </footer>
        </main>
      </div>

      {/* Add clothing modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/45 p-0 backdrop-blur-[3px] sm:items-center sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal()
          }}
        >
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-[#faf9f6] p-5 shadow-2xl sm:rounded-3xl sm:p-7">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[2px] text-amber-800">
                  YOUR COLLECTION
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900">
                  Add a new piece
                </h2>
                <p className="mt-2 text-sm text-stone-500">
                  Let&apos;s give this piece a home.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-xl p-2 text-stone-500 transition hover:bg-stone-200"
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddCloth} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Clothing photo <span className="text-rose-500">*</span>
                </label>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="relative flex min-h-[170px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-stone-300 bg-white transition hover:border-amber-700"
                >
                  {photo ? (
                    <>
                      <img
                        src={photo}
                        alt="Clothing preview"
                        className="absolute inset-0 h-full w-full object-contain"
                      />

                      <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-medium text-stone-700 shadow">
                        <Camera size={14} />
                        Change photo
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-800">
                        <UploadCloud size={23} />
                      </span>

                      <span className="mt-3 text-sm font-medium text-stone-700">
                        Upload clothing photo
                      </span>

                      <span className="mt-1 text-xs text-stone-400">
                        JPG, PNG or WebP · Max 5 MB
                      </span>
                    </>
                  )}
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>

              <div>
                <label
                  htmlFor="cloth-name"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  Clothing name <span className="text-rose-500">*</span>
                </label>

                <input
                  id="cloth-name"
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="e.g. My favourite black kurti"
                  className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm outline-none transition placeholder:text-stone-400 focus:border-amber-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="cloth-category"
                    className="mb-2 block text-sm font-medium text-stone-700"
                  >
                    Category
                  </label>

                  <select
                    id="cloth-category"
                    value={form.category}
                    onChange={(event) =>
                      setForm({ ...form, category: event.target.value })
                    }
                    className="h-12 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm outline-none focus:border-amber-700"
                  >
                    {categories
                      .filter((category) => category !== 'All Clothes')
                      .map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="cloth-color"
                    className="mb-2 block text-sm font-medium text-stone-700"
                  >
                    Colour
                  </label>

                  <input
                    id="cloth-color"
                    value={form.color}
                    onChange={(event) =>
                      setForm({ ...form, color: event.target.value })
                    }
                    placeholder="e.g. Pink"
                    className="h-12 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm outline-none placeholder:text-stone-400 focus:border-amber-700"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="cloth-occasion"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  Occasion
                </label>

                <select
                  id="cloth-occasion"
                  value={form.occasion}
                  onChange={(event) =>
                    setForm({ ...form, occasion: event.target.value })
                  }
                  className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm outline-none focus:border-amber-700"
                >
                  <option>Casual</option>
                  <option>College</option>
                  <option>Work</option>
                  <option>Party</option>
                  <option>Wedding</option>
                  <option>Festive</option>
                  <option>Travel</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="cloth-owner"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  Whose wardrobe?
                </label>

                <select
                  id="cloth-owner"
                  value={form.owner}
                  onChange={(event) =>
                    setForm({ ...form, owner: event.target.value })
                  }
                  className="h-12 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm outline-none focus:border-amber-700"
                >
                  {familyMembers
                    .filter((member) => member.id !== 'all')
                    .map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.emoji} {member.name}
                      </option>
                    ))}
                </select>
              </div>

              {formError && (
                <p
                  role="alert"
                  className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700"
                >
                  {formError}
                </p>
              )}

              <div className="flex gap-3 border-t border-stone-200 pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-600 transition hover:bg-stone-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-stone-700"
                >
                  <Check size={17} />
                  Save clothing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clothing details modal */}
      {selectedCloth && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/45 p-0 backdrop-blur-[3px] sm:items-center sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedCloth(null)
            }
          }}
        >
          <div className="relative grid max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-[#faf9f6] sm:grid-cols-2 sm:rounded-3xl">
            <button
              onClick={() => setSelectedCloth(null)}
              className="absolute right-3 top-3 z-10 rounded-full bg-white/95 p-2 text-stone-700 shadow-sm"
              aria-label="Close details"
            >
              <X size={19} />
            </button>

            <div className="aspect-[4/3] overflow-hidden bg-stone-100 sm:aspect-auto">
              <img
                src={selectedCloth.image}
                alt={selectedCloth.name}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-col p-6 sm:p-7">
              <p className="text-xs font-medium uppercase tracking-[2px] text-amber-800">
                CLOTHING DETAILS
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-900">
                {selectedCloth.name}
              </h2>

              <div className="mt-5 space-y-3 text-sm">
                <DetailRow label="Category" value={selectedCloth.category} />
                <DetailRow label="Colour" value={selectedCloth.color} />
                <DetailRow label="Occasion" value={selectedCloth.occasion} />
                <DetailRow
                  label="Owner"
                  value={
                    familyMembers.find(
                      (member) => member.id === selectedCloth.owner,
                    )?.name || 'My Wardrobe'
                  }
                />
              </div>

              <button
                onClick={() => toggleFavorite(selectedCloth.id)}
                className="mt-7 flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-medium text-stone-700 transition hover:border-rose-200 hover:text-rose-600"
              >
                <Heart
                  size={17}
                  fill={selectedCloth.favorite ? 'currentColor' : 'none'}
                  className={
                    selectedCloth.favorite ? 'text-rose-500' : ''
                  }
                />
                {selectedCloth.favorite
                  ? 'Remove from favourites'
                  : 'Add to favourites'}
              </button>

              <button
                onClick={() => deleteCloth(selectedCloth.id)}
                className="mt-3 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
              >
                <Trash2 size={16} />
                Delete clothing item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SidebarItem({ icon: Icon, label, active, count, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm transition ${
        active
          ? 'bg-stone-900 font-medium text-white shadow-sm'
          : 'text-stone-500 hover:bg-white hover:text-stone-800'
      }`}
    >
      <Icon size={18} strokeWidth={1.8} />

      <span className="flex-1 text-left">{label}</span>

      {count > 0 && (
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] ${
            active ? 'bg-white/15 text-white' : 'bg-stone-100 text-stone-500'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  )
}

function StatCard({ icon: Icon, label, value, detail }) {
  return (
    <div className="rounded-2xl border border-stone-200/80 bg-white p-4 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-medium text-stone-500">{label}</span>

        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#f5f0e8] text-stone-600">
          <Icon size={16} />
        </span>
      </div>

      <p className="mt-4 text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
        {value}
      </p>

      <p className="mt-1 text-[10px] leading-4 text-stone-400 sm:text-xs">
        {detail}
      </p>
    </div>
  )
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-stone-200 pb-3">
      <span className="text-stone-500">{label}</span>
      <span className="text-right font-medium text-stone-800">{value}</span>
    </div>
  )
}

export default App