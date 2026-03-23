"use client";

type FiltersSidebarProps = {
    selectedSizes: string[];
    toggleSize: (size: string) => void;
    selectedColors: string[];
    toggleColor: (color: string) => void;
    inStockOnly: boolean;
    setInStockOnly: (value: boolean) => void;
    resetFilters: () => void;
};

const sizes = ["XS", "S", "M", "L", "XL"];
const colors = ["#5c6173", "#d9d9cf", "#c62f2f", "#d8d2c8", "#b7b0a3", "#000000", "brown", "green"];

export default function FiltersSidebar({
                                           selectedSizes,
                                           toggleSize,
                                           selectedColors,
                                           toggleColor,
                                           inStockOnly,
                                           setInStockOnly,
                                           resetFilters,
                                       }: FiltersSidebarProps) {
    return (
        <div className="w-[220px] text-black">
            <div className="mb-6 border-b border-black pb-3">
                <div className="flex items-center justify-between text-[10px] tracking-widest">
                    <span>GEN</span>
                    <button type="button" className="text-black">
                        +
                    </button>
                </div>
            </div>

            <div className="mb-6 border-b border-black pb-3">
                <div className="mb-3 flex items-center justify-between text-[10px] tracking-widest">
                    <span>MĂRIME</span>
                    <button type="button" className="text-black">
                        −
                    </button>
                </div>

                <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => {
                        const isActive = selectedSizes.includes(size);

                        return (
                            <button
                                key={size}
                                type="button"
                                onClick={() => toggleSize(size)}
                                className={`min-w-[32px] border px-2 py-1 text-[9px] tracking-widest ${
                                    isActive
                                        ? "border-black bg-black text-white"
                                        : "border-black bg-white text-black"
                                }`}
                            >
                                {size}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="mb-6 border-b border-black pb-3">
                <div className="mb-3 flex items-center justify-between text-[10px] tracking-widest">
                    <span>CULOARE</span>
                    <button type="button" className="text-black">
                        −
                    </button>
                </div>

                <div className="flex flex-wrap gap-2">
                    {colors.map((color) => {
                        const isActive = selectedColors.includes(color);

                        return (
                            <button
                                key={color}
                                type="button"
                                onClick={() => toggleColor(color)}
                                aria-label={`Select color ${color}`}
                                className={`h-4 w-4 border border-black ${
                                    isActive ? "ring-1 ring-black ring-offset-1" : ""
                                }`}
                                style={{ backgroundColor: color }}
                            />
                        );
                    })}
                </div>
            </div>

            <div className="mb-6 border-b border-black pb-3">
                <div className="mb-3 flex items-center justify-between text-[10px] tracking-widest">
                    <span>STOC</span>
                    <button type="button" className="text-black">
                        −
                    </button>
                </div>

                <label className="flex items-center gap-2 text-[10px] tracking-widest">
                    <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={(e) => setInStockOnly(e.target.checked)}
                        className="h-3 w-3 accent-black"
                    />
                    <span>ÎN STOC</span>
                </label>
            </div>

            <div>
                <p className="mb-3 text-[10px] tracking-widest">RESETEAZĂ FILTRE</p>
                <button
                    type="button"
                    onClick={resetFilters}
                    className="border border-black px-3 py-2 text-[9px] tracking-widest text-black"
                >
                    RESET
                </button>
            </div>
        </div>
    );
}