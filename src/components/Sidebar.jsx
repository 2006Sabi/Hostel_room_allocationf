import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ title, titleRender, subtitle, items, activeItem, onSelectItem }) => {
    const location = useLocation();

    return (
        <div className="w-full md:w-64 bg-white border-r border-gray-200 shadow-sm flex-shrink-0 flex flex-col min-h-[calc(100vh-64px)]">
            <div className="p-6">
                {titleRender ? (
                    titleRender()
                ) : (
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">{title}</h2>
                )}
                {subtitle && <p className="text-sm text-gray-500 mt-1 truncate">{subtitle}</p>}
            </div>
            <nav className="px-4 space-y-2 flex-1 pb-6">
                {items.map((item, index) => {
                    const Icon = item.icon;
                    // Check if active based on state id, or URL path
                    const isActive = item.id
                        ? item.id === activeItem
                        : (item.path && location.pathname.startsWith(item.path));

                    const content = (
                        <>
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </>
                    );

                    const className = `w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${isActive
                        ? 'bg-red-50 text-red-600 font-bold shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 font-medium'
                        }`;

                    if (item.path) {
                        return (
                            <Link key={item.path || index} to={item.path} className={className}>
                                {content}
                            </Link>
                        );
                    }

                    return (
                        <button
                            key={item.id || index}
                            onClick={() => {
                                if (item.onClick) {
                                    item.onClick();
                                } else if (onSelectItem) {
                                    onSelectItem(item.id);
                                }
                            }}
                            className={className}
                        >
                            {content}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default Sidebar;
