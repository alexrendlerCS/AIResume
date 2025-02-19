export function Footer() {
  return (
    <footer className="bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-600">
          © {new Date().getFullYear()} AI Resume Builder. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

