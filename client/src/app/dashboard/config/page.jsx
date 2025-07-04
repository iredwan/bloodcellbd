'use client';

import React, { useState, useEffect } from 'react';
import { useWebsiteConfig, useUpdateWebsiteConfigMutation } from '@/features/websiteConfig/configApiSlice';
import { FaImage, FaPhone, FaGlobe, FaTags, FaChartBar, FaEdit, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ImageUpload from '@/components/ImageUpload';
import uploadFiles from '@/utils/fileUpload';

const ConfigPage = () => {
  const { config, loading, error, refreshConfig } = useWebsiteConfig();
  const [updateConfig, { isLoading: isUpdating }] = useUpdateWebsiteConfigMutation();
  const [form, setForm] = useState(config);
  // Section edit states
  const [editContact, setEditContact] = useState(false);
  const [editSocial, setEditSocial] = useState(false);
  const [editMeta, setEditMeta] = useState(false);
  const [editLogo, setEditLogo] = useState(false);
  const [localError, setLocalError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl] = useState(process.env.NEXT_PUBLIC_IMAGE_URL || '');
  
  // Preview states for logo and favicon
  const [logoPreview, setLogoPreview] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(null);

  useEffect(() => {
    setForm(config);
    setEditContact(false);
    setEditSocial(false);
    setEditMeta(false);
    setEditLogo(false);
    
    // Reset previews when config changes
    setLogoPreview(config.logo ? `${imageUrl}${config.logo}` : null);
    setFaviconPreview(config.favicon ? `${imageUrl}${config.favicon}` : null);
  }, [config, imageUrl]);

  // Handlers for section edit toggles
  const handleEdit = (section) => {
    setEditContact(section === 'contact');
    setEditSocial(section === 'social');
    setEditMeta(section === 'meta');
    setEditLogo(section === 'logo');
    setLocalError('');
  };
  
  const handleCancel = () => {
    setForm(config);
    setEditContact(false);
    setEditSocial(false);
    setEditMeta(false);
    setEditLogo(false);
    setLocalError('');
    
    // Reset previews when canceling
    setLogoPreview(config.logo ? `${imageUrl}${config.logo}` : null);
    setFaviconPreview(config.favicon ? `${imageUrl}${config.favicon}` : null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [section, key] = name.split('.');
      setForm((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value,
        },
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (name, file) => {
    // Create object URL for preview
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      
      if (name === 'logo') {
        setLogoPreview(previewUrl);
      } else if (name === 'favicon') {
        setFaviconPreview(previewUrl);
      }
    }
    
    // Update form state with the file object
    setForm(prev => ({
      ...prev,
      [name]: file
    }));
  };

  // Only update the relevant section
  const handleSectionSave = async () => {
    setLocalError('');
    setIsUploading(true);
    
    try {
      let configData = { ...form };

      // Handle logo upload
      if (form.logo instanceof File) {
        try {
          const logoUploadResult = await uploadFiles([form.logo], {
            maxFiles: 1,
            onError: (error) => {
              throw new Error(error);
            }          
          });
          configData.logo = logoUploadResult[0].filename;
        } catch (error) {
          toast.error(`Failed to upload logo: ${error.message || error}`);
          setIsUploading(false);
          return;
        }
      }

      // Handle favicon upload
      if (form.favicon instanceof File) {
        try {
          const faviconUploadResult = await uploadFiles([form.favicon], {
            maxFiles: 1,
            onError: (error) => {
              throw new Error(error);
            }
          });
          configData.favicon = faviconUploadResult[0].filename;
        } catch (error) {
          toast.error(`Failed to upload favicon: ${error.message || error}`);
          setIsUploading(false);
          return;
        }
      }

      await updateConfig(configData).unwrap();
      toast.success('Configuration updated successfully!');
      setEditContact(false);
      setEditSocial(false);
      setEditMeta(false);
      setEditLogo(false);
      refreshConfig();
    } catch (err) {
      setLocalError(err?.data?.message || err?.message || 'Failed to update configuration');
      toast.error(err?.data?.message || err?.message || 'Failed to update configuration');
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen"><div className="h-10 w-10 border-t-2 border-b-2 border-[#8a0303] rounded-full animate-spin dark:border-white"></div></div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <div className="rounded-lg overflow-hidden shadow bg-white dark:bg-gray-800">
        <form className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <FaTags className="text-primary" /> Website Configuration
            </h1>
          </div>

          {/* Logo & Favicon */}
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 mx-6">
            <div className="flex flex-col gap-2 md:flex-row md:gap-0 items-center justify-between mb-4 text-lg font-semibold">
              <span className="flex items-center gap-2 text-gray-900 dark:text-gray-100"><FaImage className="text-primary" /> Logo & Favicon</span>
              {editLogo ? (
                <div className="flex gap-2">
                  <button type="button" onClick={handleSectionSave} className="bg-green-500 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-green-600 disabled:opacity-70 text-sm" disabled={isUpdating || isUploading}><FaCheck /> Save</button>
                  <button type="button" onClick={handleCancel} className="bg-red-500 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-red-600 text-sm"><FaTimes /> Cancel</button>
                </div>
              ) : (
                <button type="button" onClick={() => handleEdit('logo')} className="bg-blue-500 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-blue-600 text-sm"><FaEdit /> Edit</button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col items-center">
                {editLogo ? (
                  <ImageUpload
                    label="Logo"
                    name="logo"
                    onChange={(file) => handleFileChange('logo', file)}
                    height={120}
                    width={120}
                    rounded="md"
                    defaultImage={logoPreview}
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-2 text-lg font-semibold dark:text-white">
                      <FaImage className="text-primary" /> Logo
                    </div>
                    {form.logo ? (
                      <img src={`${imageUrl}${form.logo}`} alt="Logo" className="h-30 rounded-md shadow" />
                    ) : (
                      <div className="text-gray-400">No logo uploaded</div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-center">
                {editLogo ? (
                  <ImageUpload
                    label="Favicon"
                    name="favicon"
                    onChange={(file) => handleFileChange('favicon', file)}
                    height={120}
                    width={120}
                    rounded="md"
                    defaultImage={faviconPreview}
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-2 text-lg font-semibold dark:text-white">
                      <FaImage className="text-primary" /> Favicon
                    </div>
                    {form.favicon ? (
                      <img src={`${imageUrl}${form.favicon}`} alt="Favicon" className="h-30 rounded-md shadow" />
                    ) : (
                      <div className="text-gray-400">No favicon uploaded</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Info Section */}
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 mx-6">
            <div className="flex flex-col gap-2 md:flex-row md:gap-0 items-center justify-between mb-4 text-lg font-semibold">
              <span className="flex items-center gap-2 text-gray-900 dark:text-gray-100"><FaPhone className="text-primary" /> Contact Info</span>
              {editContact ? (
                <div className="flex gap-2">
                  <button type="button" onClick={handleSectionSave} className="bg-green-500 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-green-600 disabled:opacity-70 text-sm" disabled={isUpdating}><FaCheck /> Save</button>
                  <button type="button" onClick={handleCancel} className="bg-red-500 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-red-600 text-sm"><FaTimes /> Cancel</button>
                </div>
              ) : (
                <button type="button" onClick={() => handleEdit('contact')} className="bg-blue-500 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-blue-600 text-sm"><FaEdit /> Edit</button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['email', 'phone', 'address'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-100 capitalize">{field}</label>
                  {editContact ? (
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      name={`contactInfo.${field}`}
                      value={form.contactInfo?.[field] || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
                    />
                  ) : (
                    <span className="text-gray-700 dark:text-gray-100 break-all">{form.contactInfo?.[field]}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Social Media Section */}
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 mx-6">
            <div className="flex flex-col gap-2 md:flex-row md:gap-0 items-center justify-between mb-4 text-lg font-semibold">
              <span className="flex items-center gap-2 text-gray-900 dark:text-gray-100"><FaGlobe className="text-primary" /> Social Media</span>
              {editSocial ? (
                <div className="flex gap-2">
                  <button type="button" onClick={handleSectionSave} className="bg-green-500 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-green-600 disabled:opacity-70 text-sm" disabled={isUpdating}><FaCheck /> Save</button>
                  <button type="button" onClick={handleCancel} className="bg-red-500 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-red-600 text-sm"><FaTimes /> Cancel</button>
                </div>
              ) : (
                <button type="button" onClick={() => handleEdit('social')} className="bg-blue-500 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-blue-600 text-sm"><FaEdit /> Edit</button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {['facebook', 'instagram', 'linkedin', 'youtube'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-100 capitalize">{field}</label>
                  {editSocial ? (
                    <input
                      type="text"
                      name={`socialMedia.${field}`}
                      value={form.socialMedia?.[field] || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 pr-10 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
                    />
                  ) : (
                    <span className="text-gray-700 dark:text-gray-100 break-all">{form.socialMedia?.[field]}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Stats (read-only) */}
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 mx-6 mb-8">
            <div className="flex items-center justify-center gap-2 mb-4 text-lg font-semibold dark:text-white">
              <FaChartBar className="text-primary" /> Website Stats
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="block text-sm text-gray-500">Total Members</span>
                <span className="text-lg font-bold dark:text-gray-100">{form.stats?.totalMembers ?? 0}</span>
              </div>
              <div>
                <span className="block text-sm text-gray-500">Eligible Members</span>
                <span className="text-lg font-bold dark:text-gray-100">{form.stats?.totalEligibleMembers ?? 0}</span>
              </div>
              <div>
                <span className="block text-sm text-gray-500">Fulfilled Requests</span>
                <span className="text-lg font-bold dark:text-gray-100">{form.stats?.totalFulfilledRequests ?? 0}</span>
              </div>
              <div>
                <span className="block text-sm text-gray-500">Pending Requests</span>
                <span className="text-lg font-bold dark:text-gray-100">{form.stats?.totalPendingRequests ?? 0}</span>
              </div>
            </div>
          </div>

          {/* Error */}
          {localError && <div className="text-red-600 dark:text-red-400 text-center pb-4">{localError}</div>}
        </form>
      </div>
    </div>
  );
};

export default ConfigPage;