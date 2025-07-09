import { useEffect, useState, useRef, useCallback } from "react"
import { useGetUsersByNidOrBirthRegQuery } from "@/features/users/userApiSlice"
import Image from "next/image"

// Debounce utility
function useDebounce(value, delay = 200) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

const PersonSelector = ({ onSelect, label, initialValue }) => {
  const [inputValue, setInputValue] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [triggerSearch, setTriggerSearch] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const wrapperRef = useRef(null)
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL

  const debouncedInput = useDebounce(inputValue, 500)

  const { data, isFetching } = useGetUsersByNidOrBirthRegQuery(debouncedInput, {
    skip: !debouncedInput || !triggerSearch,
  })

  const responseData = data?.data

  // Initial value handling
  useEffect(() => {
    if (initialValue && !selectedUser) {
      setSelectedUser({ name: initialValue })
      setInputValue(initialValue)
    }
  }, [initialValue, selectedUser])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (debouncedInput.trim()) {
      setTriggerSearch(true)
      setIsDropdownOpen(true)
    }
    if (!inputValue) {
      setTriggerSearch(false)
      setIsDropdownOpen(false)
      setSelectedUser(null)
      onSelect(null) // Clear selection when input is empty
    }
  }, [debouncedInput, inputValue, onSelect])

  const handleSelect = () => {
    if (responseData && responseData._id) {
      setSelectedUser(responseData)
      setInputValue(responseData.name)
      onSelect(responseData._id)
      setTriggerSearch(false)
      setIsDropdownOpen(false)
    }
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value)
    if (selectedUser) {
      setSelectedUser(null)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setTriggerSearch(true)
      setIsDropdownOpen(true)
    }
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsDropdownOpen(true)}
        placeholder="Enter NID or Birth Registration"
        className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all dark:bg-gray-700 dark:text-white"
      />

      {/* Dropdown */}
      {isDropdownOpen && triggerSearch && responseData && responseData._id && (
        <div
          className="absolute z-10 w-full mt-1 border border-neutral-300 bg-white rounded-md shadow-lg max-h-60 overflow-auto dark:bg-gray-700 cursor-pointer"
          onClick={handleSelect}
        >
          <div className="flex items-center gap-3 p-2">
            <Image
              src={imageUrl+responseData.profileImage}
              alt="user"
              width={50}
              height={50}
              className="object-cover aspect-square rounded-full"
            />
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-300">
                {responseData.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Blood Group: {responseData.bloodGroup || "N/A"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PersonSelector
