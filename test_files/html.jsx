// Compare our own highlights with JSX.

function layout({ message }) {
  return (
    <body>
      Ala ma kota ale nie ma psa
      <div>
        <h1>{message}</h1>
      </div>
      {navHtml}
      {body}
      {message}
    </body>)
}

var dropdown =
  <Dropdown>
    A dropdown list
    <Menu>
      <MenuItem>Do Something</MenuItem>
      <MenuItem>Do Something Fun!</MenuItem>
      <MenuItem>Do Something Else</MenuItem>
    </Menu>
  </Dropdown>;

var box =
  <Box>
    {
      shouldShowAnswer(user) ?
        <Answer value={false}>no</Answer> :
        <Box.Comment>
          Text Content
        </Box.Comment>
    }
  </Box>;

function computeStyle() {
  if (animation === 'card') {
    if (refSliderWrapper.current) {
      const sliderElement = refSliderWrapper.current.children[0];

      if (!sliderElement) {
        return;
      }

      if (direction === 'horizontal') {
        const totalWidth = refSliderWrapper.current.clientWidth;
        const sliderWidth = sliderElement.clientWidth;
        const edge = (totalWidth - sliderWidth) / 2;

        // deltaZ is TranslateZ(-Zpx) of prev/next slider's style
        // perspective / (perspective + deltaZ) = x / X
        const deltaZ = 200;
        const x = totalWidth / 2;
        const X = sliderWidth;
        // avoid getting a huge perspective value
        const perspective = x + 50 >= X ? deltaZ * 4 : (deltaZ * x) / (X - x);

        setComputedStyle({
          sliderWrapper: {
            perspective,
          },
          indicatorWrapper: {
            width: 'auto',
            left: edge,
            right: edge,
          },
        });
      } else {
        const totalHeight = refSliderWrapper.current.clientHeight;
        const sliderHeight = sliderElement.clientHeight;
        const edge = (totalHeight - sliderHeight) / 2;

        // deltaZ is TranslateZ(-Zpx) of prev/next slider's style
        // perspective / (perspective + deltaZ) = x / X
        const deltaZ = 200;
        const y = totalHeight / 2;
        const Y = sliderHeight;
        // avoid getting a huge perspective value
        const perspective = y + 50 >= Y ? deltaZ * 4 : (deltaZ * y) / (Y - y);

        setComputedStyle({
          sliderWrapper: {
            perspective,
          },
          indicatorWrapper: {
            height: 'auto',
            top: edge,
            bottom: edge,
          },
        });
      }
    }
  } else {
    setComputedStyle({
      sliderWrapper: null,
      indicatorWrapper: null,
    });
  }
}

const prefixCls = getPrefixCls('carousel');
const classNames = cs(
  prefixCls,
  `${prefixCls}-indicator-position-${indicatorPosition}`,
  {
    [`${prefixCls}-rtl`]: rtl,
  },
  className
);
const eventHandlers = Object.assign(
  {},
  autoPlay && (typeof autoPlay !== 'object' || autoPlay.hoverToPause !== false)
    ? {
      onMouseEnter: () => setIsPause(true),
      onMouseLeave: () => setIsPause(false),
    }
    : null
);

let [slideToPrev, slideToNext] = [
  () =>
    slideTo({
      targetIndex: prevIndex,
      isNegative: true,
      isManual: true,
    }),

  () =>
    slideTo({
      targetIndex: nextIndex,
      isManual: true,
    }),
];
if (rtl) {
  [slideToPrev, slideToNext] = [slideToNext, slideToPrev];
}

return (
  <ResizeObserver onResize={computeStyle} getTargetDOMNode={() => refDom.current}>
    <div
      ref={(_ref) => {
        ref = _ref;
        refDom.current = ref;
      }}
      className={classNames}
      style={style}
      {...omit(rest, ['autoplay', 'autoPlaySpeed'])}
      {...eventHandlers}
    >
      <div
        ref={refSliderWrapper}
        style={computedStyle.sliderWrapper}
        className={cs(`${prefixCls}-${animation}`, `${prefixCls}-${direction}`, {
          [`${prefixCls}-negative`]: slideDirection === 'negative',
        })}
      >
        {childrenList.map((child, index) => {
          const isCurrent = index === mergedIndex;
          const isPrev = index === prevIndex;
          const isNext = index === nextIndex;
          const shouldRenderChild = !miniRender || isCurrent || isPrev || isNext;

          if (!shouldRenderChild) {
            return null;
          }

          const {
            style: childStyle,
            className: childClassName,
            onClick: childOnClick,
          } = child.props;

          return React.cloneElement(child, {
            'aria-hidden': !isCurrent,
            style: Object.assign(
              {
                transitionTimingFunction: timingFunc,
                transitionDuration: `${moveSpeed}ms`,
                animationTimingFunction: timingFunc,
                animationDuration: `${moveSpeed}ms`,
              },
              childStyle
            ),
            className: cs(childClassName, {
              [`${prefixCls}-item-prev`]: isPrev,
              [`${prefixCls}-item-next`]: isNext,
              [`${prefixCls}-item-current`]: isCurrent,
              [`${prefixCls}-item-slide-in`]:
                animation === 'slide' && slideDirection && isAnimating && isCurrent,
              [`${prefixCls}-item-slide-out`]:
                animation === 'slide' && slideDirection && isAnimating && index === previousIndex,
            }),
            onClick: (event) => {
              childOnClick && childOnClick(event);
              slideTo({
                targetIndex: index,
                isNegative: index === prevIndex,
                isManual: true,
              });
            },
          });
        })}
      </div>

      {indicatorType !== 'never' && childrenLength > 1 && (
        <div
          style={computedStyle.indicatorWrapper}
          className={cs(
            `${prefixCls}-indicator-wrapper`,
            `${prefixCls}-indicator-wrapper-${indicatorPosition}`
          )}
        >
          <CarouselIndicator
            className={indicatorClassName}
            type={indicatorType}
            count={childrenLength}
            activeIndex={mergedIndex}
            position={indicatorPosition}
            trigger={trigger}
            onSelectIndex={(index) =>
              slideTo({
                targetIndex: index,
                isNegative: index < mergedIndex,
                isManual: true,
              })
            }
          />
        </div>
      )}

      {showArrow !== 'never' && childrenLength > 1 && (
        <CarouselArrow
          className={arrowClassName}
          direction={direction}
          showArrow={showArrow}
          icons={icons}
          prev={slideToPrev}
          next={slideToNext}
        />
      )}
    </div>
  </ResizeObserver>
);
