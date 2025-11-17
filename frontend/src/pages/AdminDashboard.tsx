import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, FolderOpen, QrCode, Settings } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { menuApi, type MenuItem } from '../api/menu.api';
import { categoryApi, type Category } from '../api/category.api';
import { tenantApi, type Tenant as FullTenant } from '../api/tenant.api';
import apiClient from '../api/client';

type SectionKey = 'overview' | 'menu' | 'categories' | 'settings';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, tenant, logout } = useAuthStore();

  const [activeSection, setActiveSection] = useState<SectionKey>('overview');

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoadingMenu, setIsLoadingMenu] = useState(false);
  const [menuError, setMenuError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  const [qrError, setQrError] = useState<string | null>(null);
  const [isDownloadingQR, setIsDownloadingQR] = useState(false);

  const [settingsTenant, setSettingsTenant] = useState<FullTenant | null>(null);
  const [settingsForm, setSettingsForm] = useState({
    businessName: '',
    businessType: '',
    whatsappNumber: '',
    primaryColor: '#f97316',
    currency: 'USD',
  });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [settingsSuccess, setSettingsSuccess] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api') as string;
  const fileBase = apiBase.replace(/\/?api$/, '');

  const buildImageUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${fileBase}${url}`;
  };

  const navButtonClass = (section: SectionKey) =>
    `w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
      activeSection === section
        ? 'bg-orange-50 text-primary-700 font-medium'
        : 'hover:bg-orange-50 text-gray-700'
    }`;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // --- Loaders --------------------------------------------------------------

  const loadMenuItems = async () => {
    if (!tenant?.id) {
      setMenuError('Tenant identifier required');
      return;
    }
    try {
      setIsLoadingMenu(true);
      setMenuError(null);
      const items = await menuApi.getMenuItems({ tenantId: tenant.id });
      setMenuItems(items);
    } catch (err: any) {
      setMenuError(err?.response?.data?.error || 'Failed to load menu items');
    } finally {
      setIsLoadingMenu(false);
    }
  };

  const loadCategories = async () => {
    if (!tenant?.id) {
      setCategoryError('Tenant identifier required');
      return;
    }
    try {
      setIsLoadingCategories(true);
      setCategoryError(null);
      const data = await categoryApi.getCategories({ tenantId: tenant.id });
      setCategories(data);
    } catch (err: any) {
      setCategoryError(err?.response?.data?.error || 'Failed to load categories');
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const loadTenantSettings = async () => {
    if (!tenant?.id) return;
    try {
      setSettingsLoading(true);
      setSettingsError(null);
      const fullTenant = await tenantApi.getTenantById(tenant.id);
      setSettingsTenant(fullTenant);
      setSettingsForm({
        businessName: fullTenant.businessName,
        businessType: fullTenant.businessType,
        whatsappNumber: fullTenant.whatsappNumber,
        primaryColor: fullTenant.primaryColor || '#f97316',
        currency: fullTenant.currency || 'USD',
      });
    } catch (err: any) {
      setSettingsError(err?.response?.data?.error || 'Failed to load settings');
    } finally {
      setSettingsLoading(false);
    }
  };

  useEffect(() => {
    if (!tenant?.id) return;
    loadMenuItems();
    loadCategories();
    loadTenantSettings();
  }, [tenant?.id]);

  // --- QR -------------------------------------------------------------------

  const handleDownloadQR = async () => {
    if (!tenant?.id) {
      setQrError('Tenant identifier required');
      return;
    }
    try {
      setIsDownloadingQR(true);
      setQrError(null);
      const response = await apiClient.get(`/qr/download/${tenant.id}`, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'image/png' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${tenant.slug || 'menu'}-qr-code.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setQrError(err?.response?.data?.error || 'Failed to download QR code');
    } finally {
      setIsDownloadingQR(false);
    }
  };

  // --- Section renders ------------------------------------------------------

  const renderOverview = () => (
    <>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <h3 className="text-gray-600 text-sm font-medium">Menu Items</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{menuItems.length}</p>
        </div>
        <div className="card">
          <h3 className="text-gray-600 text-sm font-medium">Categories</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{categories.length}</p>
        </div>
        <div className="card">
          <h3 className="text-gray-600 text-sm font-medium">Status</h3>
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-100">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm font-semibold text-green-700 uppercase tracking-wide">
              {tenant?.status || 'TRIAL'}
            </span>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        {qrError && (
          <div className="mb-3 p-2 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
            {qrError}
          </div>
        )}
        <div className="grid md:grid-cols-2 gap-4">
          <button
            className="btn-primary text-left p-4 flex flex-col gap-1"
            onClick={() => {
              setActiveSection('menu');
              setEditingItem(null);
              setNewItem({ name: '', description: '', price: '', categoryId: '' });
              setImageFile(null);
            }}
          >
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/20">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div className="font-semibold">Add Menu Item</div>
            <div className="text-sm opacity-80">Create a new dish or beverage</div>
          </button>
          <button
            className="btn-secondary text-left p-4 flex flex-col gap-1"
            onClick={() => setActiveSection('categories')}
          >
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white">
              <FolderOpen className="w-5 h-5 text-primary-600" />
            </div>
            <div className="font-semibold">Manage Categories</div>
            <div className="text-sm opacity-80">Organize your menu</div>
          </button>
          <button
            className="btn-secondary text-left p-4 flex flex-col gap-1"
            onClick={handleDownloadQR}
            disabled={isDownloadingQR}
          >
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white">
              <QrCode className="w-5 h-5 text-primary-600" />
            </div>
            <div className="font-semibold">
              {isDownloadingQR ? 'Preparing QR...' : 'Download QR Code'}
            </div>
            <div className="text-sm opacity-80">Get your menu QR code</div>
          </button>
          <button
            className="btn-secondary text-left p-4 flex flex-col gap-1"
            onClick={() => setActiveSection('settings')}
          >
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white">
              <Settings className="w-5 h-5 text-primary-600" />
            </div>
            <div className="font-semibold">Settings</div>
            <div className="text-sm opacity-80">Customize your menu</div>
          </button>
        </div>
      </div>

      {tenant?.slug && (
        <div className="mt-8 card bg-primary-50 border-2 border-primary-200">
          <h3 className="font-semibold mb-2">Your Menu URL</h3>
          <a
            href={`/${tenant.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 underline"
          >
            {window.location.origin}/{tenant.slug}
          </a>
          <p className="text-sm text-gray-600 mt-2">
            Share this link with your customers or use the QR code
          </p>
        </div>
      )}
    </>
  );

  const renderMenu = () => (
    <section className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Menu Items</h2>
          <button className="btn-secondary" onClick={loadMenuItems} disabled={isLoadingMenu}>
            {isLoadingMenu ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {menuError && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {menuError}
          </div>
        )}

        {menuItems.length === 0 && !isLoadingMenu ? (
          <p className="text-gray-600 text-sm">
            No menu items yet. Use the form on the right to add your first dish.
          </p>
        ) : (
          <div className="space-y-3 max-h-[28rem] overflow-y-auto pr-1">
            {menuItems.map(item => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-4 border border-gray-100 rounded-lg p-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-slate-900">{item.name}</h3>
                    {!item.isAvailable && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">
                        Unavailable
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                  )}
                  <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                    <span className="font-semibold text-primary-700 text-sm">
                      ${item.price.toFixed(2)}
                    </span>
                    {item.category?.name && <span>• {item.category.name}</span>}
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end text-xs">
                  <button
                    type="button"
                    className="px-3 py-1 rounded-lg border border-primary-100 text-primary-700 hover:bg-primary-50"
                    onClick={() => {
                      setEditingItem(item);
                      setNewItem({
                        name: item.name,
                        description: item.description || '',
                        price: String(item.price),
                        categoryId: item.categoryId || '',
                      });
                      setImageFile(null);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                    onClick={async () => {
                      if (!window.confirm('Delete this menu item?')) return;
                      try {
                        setMenuError(null);
                        await menuApi.deleteMenuItem(item.id);
                        if (editingItem?.id === item.id) {
                          setEditingItem(null);
                          setNewItem({ name: '', description: '', price: '', categoryId: '' });
                          setImageFile(null);
                        }
                        await loadMenuItems();
                      } catch (err: any) {
                        setMenuError(err?.response?.data?.error || 'Failed to delete menu item');
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">
          {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
        </h2>
        <form
          className="space-y-4"
          onSubmit={async e => {
            e.preventDefault();
            try {
              setMenuError(null);
              const priceNumber = parseFloat(newItem.price || '0');
              if (!newItem.name || !priceNumber) {
                setMenuError('Name and price are required');
                return;
              }

              let targetId: string;
              if (editingItem) {
                const updated = await menuApi.updateMenuItem(editingItem.id, {
                  name: newItem.name,
                  description: newItem.description || undefined,
                  price: priceNumber,
                  categoryId: newItem.categoryId || undefined,
                });
                targetId = updated.id;
              } else {
                const created = await menuApi.createMenuItem({
                  name: newItem.name,
                  description: newItem.description || undefined,
                  price: priceNumber,
                  isAvailable: true,
                  categoryId: newItem.categoryId || undefined,
                });
                targetId = created.id;
              }

              if (imageFile) {
                await menuApi.uploadImage(targetId, imageFile);
              }

              setNewItem({ name: '', description: '', price: '', categoryId: '' });
              setImageFile(null);
              setEditingItem(null);
              await loadMenuItems();
            } catch (err: any) {
              setMenuError(err?.response?.data?.error || 'Failed to create menu item');
            }
          }}
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              className="input-field"
              value={newItem.name}
              onChange={e => setNewItem(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              className="input-field"
              value={newItem.categoryId}
              onChange={e => setNewItem(prev => ({ ...prev, categoryId: e.target.value }))}
            >
              <option value="">No category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              className="input-field min-h-[80px]"
              value={newItem.description}
              onChange={e => setNewItem(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700" htmlFor="price">
              Price
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0"
              className="input-field"
              value={newItem.price}
              onChange={e => setNewItem(prev => ({ ...prev, price: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700" htmlFor="image">
              Image (optional)
            </label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={e => setImageFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            />
          </div>

          <button type="submit" className="w-full btn-primary">
            Save Item
          </button>
        </form>
      </div>
    </section>
  );

  const renderCategories = () => (
    <section className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Categories</h2>
        <button className="btn-secondary" onClick={loadCategories} disabled={isLoadingCategories}>
          {isLoadingCategories ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {categoryError && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {categoryError}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          {categories.length === 0 && !isLoadingCategories ? (
            <p className="text-gray-600 text-sm">
              No categories yet. Create your first one on the right.
            </p>
          ) : (
            <ul className="space-y-2 text-sm">
              {categories.map(cat => (
                <li
                  key={cat.id}
                  className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2"
                >
                  <div>
                    <span className="font-medium text-slate-900">{cat.name}</span>
                    {!cat.isActive && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">
                        Inactive
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    className="text-xs px-2 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                    onClick={async () => {
                      if (
                        !window.confirm(
                          'Delete this category? Items will remain but without this category.',
                        )
                      )
                        return;
                      try {
                        setCategoryError(null);
                        await categoryApi.deleteCategory(cat.id);
                        await loadCategories();
                        await loadMenuItems();
                      } catch (err: any) {
                        setCategoryError(err?.response?.data?.error || 'Failed to delete category');
                      }
                    }}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h3 className="text-md font-semibold mb-2">Add Category</h3>
          <form
            className="space-y-3"
            onSubmit={async e => {
              e.preventDefault();
              if (!newCategoryName.trim()) return;
              try {
                setCategoryError(null);
                await categoryApi.createCategory({ name: newCategoryName.trim() });
                setNewCategoryName('');
                await loadCategories();
              } catch (err: any) {
                setCategoryError(err?.response?.data?.error || 'Failed to create category');
              }
            }}
          >
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Starters"
              value={newCategoryName}
              onChange={e => setNewCategoryName(e.target.value)}
            />
            <button type="submit" className="btn-primary w-full">
              Save Category
            </button>
          </form>
        </div>
      </div>
    </section>
  );

  const renderSettings = () => (
    <section className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Business Settings</h2>
        {settingsLoading && <span className="text-xs text-gray-500">Loading…</span>}
      </div>

      {settingsError && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {settingsError}
        </div>
      )}

      {settingsSuccess && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
          {settingsSuccess}
        </div>
      )}

      <form
        className="grid md:grid-cols-2 gap-6"
        onSubmit={async e => {
          e.preventDefault();
          if (!tenant?.id) return;
          try {
            setSettingsLoading(true);
            setSettingsError(null);
            setSettingsSuccess(null);

            await tenantApi.updateTenant(tenant.id, {
              businessName: settingsForm.businessName || undefined,
              businessType: settingsForm.businessType || undefined,
              whatsappNumber: settingsForm.whatsappNumber || undefined,
              primaryColor: settingsForm.primaryColor || undefined,
              currency: settingsForm.currency || undefined,
            });

            if (logoFile) {
              await tenantApi.uploadLogo(tenant.id, logoFile);
              setLogoFile(null);
            }

            setSettingsSuccess('Settings saved');
            await loadTenantSettings();
          } catch (err: any) {
            setSettingsError(err?.response?.data?.error || 'Failed to save settings');
          } finally {
            setSettingsLoading(false);
          }
        }}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700" htmlFor="businessName">
              Business name
            </label>
            <input
              id="businessName"
              type="text"
              className="input-field"
              value={settingsForm.businessName}
              onChange={e =>
                setSettingsForm(prev => ({ ...prev, businessName: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700" htmlFor="businessType">
              Business type
            </label>
            <input
              id="businessType"
              type="text"
              className="input-field"
              value={settingsForm.businessType}
              onChange={e =>
                setSettingsForm(prev => ({ ...prev, businessType: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700" htmlFor="currency">
              Currency
            </label>
            <select
              id="currency"
              className="input-field"
              value={settingsForm.currency}
              onChange={e =>
                setSettingsForm(prev => ({ ...prev, currency: e.target.value }))
              }
            >
              <option value="USD">USD - US Dollar</option>
              <option value="KES">KES - Kenyan Shilling</option>
              <option value="TZS">TZS - Tanzanian Shilling</option>
              <option value="UGX">UGX - Ugandan Shilling</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700" htmlFor="whatsappNumber">
              WhatsApp number
            </label>
            <input
              id="whatsappNumber"
              type="tel"
              className="input-field"
              placeholder="e.g. +254 700 000000"
              value={settingsForm.whatsappNumber}
              onChange={e =>
                setSettingsForm(prev => ({ ...prev, whatsappNumber: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700" htmlFor="primaryColor">
              Brand color
            </label>
            <div className="flex items-center gap-3">
              <input
                id="primaryColor"
                type="color"
                className="h-10 w-16 rounded-md border border-gray-200 bg-white"
                value={settingsForm.primaryColor}
                onChange={e =>
                  setSettingsForm(prev => ({ ...prev, primaryColor: e.target.value }))
                }
              />
              <input
                type="text"
                className="input-field flex-1"
                value={settingsForm.primaryColor}
                onChange={e =>
                  setSettingsForm(prev => ({ ...prev, primaryColor: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700" htmlFor="logo">
              Logo
            </label>
            <input
              id="logo"
              type="file"
              accept="image/*"
              onChange={e => setLogoFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            />
            {settingsTenant?.logoUrl && (
              <div className="mt-2 flex items-center gap-3 text-xs text-gray-600">
                <img
                  src={buildImageUrl(settingsTenant.logoUrl)}
                  alt={settingsTenant.businessName}
                  className="h-10 w-auto object-contain rounded"
                />
                <span>Current logo</span>
              </div>
            )}
          </div>

          <button type="submit" className="btn-primary w-full" disabled={settingsLoading}>
            {settingsLoading ? 'Saving…' : 'Save Settings'}
          </button>
        </div>
      </form>
    </section>
  );

  // --- Main -----------------------------------------------------------------

  return (
    <div className="min-h-screen bg-orange-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-white/95 border-r border-orange-100 flex-col justify-between py-4 px-3">
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-2">
            <div className="h-8 w-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-bold">
              {tenant?.businessName ? tenant.businessName.charAt(0) : 'M'}
            </div>
            <div className="text-xs">
              <div className="font-semibold text-slate-900 truncate max-w-[8rem]">
                {tenant?.businessName || 'My Menu'}
              </div>
              <div className="text-[11px] text-gray-500">Admin Panel</div>
            </div>
          </div>

          <nav className="space-y-1 text-sm">
            <button
              className={navButtonClass('overview')}
              onClick={() => setActiveSection('overview')}
            >
              <span className="w-5 h-5 rounded-md bg-primary-100" />
              <span>Overview</span>
            </button>
            <button
              className={navButtonClass('menu')}
              onClick={() => setActiveSection('menu')}
            >
              <span className="w-5 h-5 rounded-md bg-gray-100" />
              <span>Menu</span>
            </button>
            <button
              className={navButtonClass('categories')}
              onClick={() => setActiveSection('categories')}
            >
              <span className="w-5 h-5 rounded-md bg-gray-100" />
              <span>Categories</span>
            </button>
            <button
              className={navButtonClass('settings')}
              onClick={() => setActiveSection('settings')}
            >
              <span className="w-5 h-5 rounded-md bg-gray-100" />
              <span>Business Settings</span>
            </button>
          </nav>
        </div>

        <div className="space-y-2 text-xs text-gray-600">
          <button className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-orange-50">
            FAQ
          </button>
          <button className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-orange-50">
            Support
          </button>
          <button
            className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-orange-50 text-red-600"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Right side */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white/90 backdrop-blur shadow-sm border-b border-orange-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-primary-700">
                {tenant?.businessName || 'Admin Dashboard'}
              </h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.firstName}!</p>
            </div>
            <button onClick={handleLogout} className="btn-secondary md:hidden">
              Logout
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeSection === 'overview' && renderOverview()}
          {activeSection === 'menu' && renderMenu()}
          {activeSection === 'categories' && renderCategories()}
          {activeSection === 'settings' && renderSettings()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;